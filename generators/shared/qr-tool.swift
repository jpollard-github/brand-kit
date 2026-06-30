import AppKit
import CoreImage
import Foundation

enum QRToolError: Error, CustomStringConvertible {
  case missingCommand
  case missingValue(String)
  case invalidCommand(String)
  case filterUnavailable
  case outputUnavailable
  case contextUnavailable
  case cgImageUnavailable
  case pngUnavailable
  case decodeUnavailable(String)

  var description: String {
    switch self {
    case .missingCommand:
      return "Missing command. Use generate or decode."
    case .missingValue(let flag):
      return "Missing value for \(flag)."
    case .invalidCommand(let command):
      return "Invalid command \(command). Use generate or decode."
    case .filterUnavailable:
      return "CIQRCodeGenerator filter unavailable."
    case .outputUnavailable:
      return "QR filter did not produce an image."
    case .contextUnavailable:
      return "Unable to create bitmap context."
    case .cgImageUnavailable:
      return "Unable to create CGImage."
    case .pngUnavailable:
      return "Unable to create PNG data."
    case .decodeUnavailable(let path):
      return "Unable to decode a QR code from \(path)."
    }
  }
}

func parseFlags(_ args: [String]) throws -> [String: String] {
  var values: [String: String] = [:]
  var index = 0

  while index < args.count {
    let arg = args[index]
    if arg.hasPrefix("--"), let separator = arg.firstIndex(of: "=") {
      let key = String(arg[..<separator])
      let value = String(arg[arg.index(after: separator)...])
      values[key] = value
    } else if arg.hasPrefix("--") {
      let key = arg
      guard index + 1 < args.count else {
        throw QRToolError.missingValue(key)
      }
      values[key] = args[index + 1]
      index += 1
    }

    index += 1
  }

  return values
}

func requireValue(_ flags: [String: String], _ key: String) throws -> String {
  guard let value = flags[key], !value.isEmpty else {
    throw QRToolError.missingValue(key)
  }
  return value
}

func generateQrPng(url: String, outputPath: String, size: Int, margin: Int, correctionLevel: String) throws {
  guard let data = url.data(using: .utf8) else {
    throw QRToolError.outputUnavailable
  }

  guard let filter = CIFilter(name: "CIQRCodeGenerator") else {
    throw QRToolError.filterUnavailable
  }
  filter.setValue(data, forKey: "inputMessage")
  filter.setValue(correctionLevel, forKey: "inputCorrectionLevel")

  guard let outputImage = filter.outputImage else {
    throw QRToolError.outputUnavailable
  }

  let extent = outputImage.extent.integral
  let innerSize = max(size - (margin * 2), 1)
  let scale = max(1, Int(floor(Double(innerSize) / max(extent.width, extent.height))))
  let transformed = outputImage.transformed(by: CGAffineTransform(scaleX: CGFloat(scale), y: CGFloat(scale)))

  let colorSpace = CGColorSpaceCreateDeviceRGB()
  guard let context = CGContext(
    data: nil,
    width: size,
    height: size,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else {
    throw QRToolError.contextUnavailable
  }

  context.interpolationQuality = .none
  context.setFillColor(NSColor.white.cgColor)
  context.fill(CGRect(x: 0, y: 0, width: size, height: size))

  let ciContext = CIContext(options: nil)
  guard let qrCgImage = ciContext.createCGImage(transformed, from: transformed.extent) else {
    throw QRToolError.cgImageUnavailable
  }

  let drawSize = transformed.extent.size
  let x = CGFloat((size - Int(drawSize.width)) / 2)
  let y = CGFloat((size - Int(drawSize.height)) / 2)
  context.draw(qrCgImage, in: CGRect(x: x, y: y, width: drawSize.width, height: drawSize.height))

  guard let finalImage = context.makeImage() else {
    throw QRToolError.cgImageUnavailable
  }

  let bitmap = NSBitmapImageRep(cgImage: finalImage)
  guard let pngData = bitmap.representation(using: .png, properties: [:]) else {
    throw QRToolError.pngUnavailable
  }

  let outputUrl = URL(fileURLWithPath: outputPath)
  try FileManager.default.createDirectory(
    at: outputUrl.deletingLastPathComponent(),
    withIntermediateDirectories: true
  )
  try pngData.write(to: outputUrl)
}

func decodeQr(path: String) throws -> String {
  let url = URL(fileURLWithPath: path)
  guard let ciImage = CIImage(contentsOf: url) else {
    throw QRToolError.decodeUnavailable(path)
  }

  let detector = CIDetector(
    ofType: CIDetectorTypeQRCode,
    context: nil,
    options: [CIDetectorAccuracy: CIDetectorAccuracyHigh]
  )

  let features = detector?.features(in: ciImage) as? [CIQRCodeFeature] ?? []
  guard let message = features.first?.messageString, !message.isEmpty else {
    throw QRToolError.decodeUnavailable(path)
  }

  return message
}

do {
  let arguments = Array(CommandLine.arguments.dropFirst())
  guard let command = arguments.first else {
    throw QRToolError.missingCommand
  }

  let flags = try parseFlags(Array(arguments.dropFirst()))

  switch command {
  case "generate":
    let url = try requireValue(flags, "--url")
    let output = try requireValue(flags, "--output")
    let size = Int(flags["--size"] ?? "1024") ?? 1024
    let margin = Int(flags["--margin"] ?? "96") ?? 96
    let correction = flags["--correction"] ?? "H"
    try generateQrPng(
      url: url,
      outputPath: output,
      size: size,
      margin: margin,
      correctionLevel: correction
    )
    print(output)
  case "decode":
    let imagePath = try requireValue(flags, "--image")
    let decoded = try decodeQr(path: imagePath)
    print(decoded)
  default:
    throw QRToolError.invalidCommand(command)
  }
} catch {
  fputs("\(error)\n", stderr)
  exit(1)
}
