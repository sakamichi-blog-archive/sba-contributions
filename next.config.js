const path = require("path")
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  output: "export",
  sassOptions: {
    includePaths: [
      path.join(__dirname, "src/styles")
    ]
  }
})
