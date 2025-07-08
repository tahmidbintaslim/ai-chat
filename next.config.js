/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { isServer }) => {
        // Set up fallbacks for Node.js modules to prevent build errors
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "fs": false,
            "path": false,
            "crypto": false,
            "stream": false,
            "util": false,
            "buffer": false,
            "process": false,
            "worker_threads": false,
            "perf_hooks": false,
            "os": false,
            "tty": false,
            "net": false,
            "child_process": false,
        }

        // Configure module rules for better ES module handling
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        })

        return config
    },
    // External packages that should not be bundled on the server
    experimental: {
        serverComponentsExternalPackages: ['@huggingface/transformers', 'onnxruntime-web'],
    },
}

module.exports = nextConfig
