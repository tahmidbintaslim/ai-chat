/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ]
            }
        ]
    },

    // Next.js 16 uses Turbopack by default
    // For compatibility with transformers.js, we'll use webpack
    serverExternalPackages: ['@huggingface/transformers', 'onnxruntime-web'],
    
    webpack: (config) => {
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

        // Fix for transformers.js and onnxruntime-web
        config.resolve.alias = {
            ...config.resolve.alias,
            'sharp$': false,
            'onnxruntime-node$': false,
        }

        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        })

        // Additional rule for transformers.js
        config.module.rules.push({
            test: /\.wasm$/,
            type: 'asset/resource',
        })

        return config
    },
}

module.exports = nextConfig
