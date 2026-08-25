import * as esbuild from 'esbuild';
import esbuildSvelte from 'esbuild-svelte';

async function build() {
    console.log("⚙️ Compiling Svelte components via esbuild...");
    
    // Bundle our compile.js wrapper which renders the Svelte tree
    await esbuild.build({
        entryPoints: ['src/svelte/compile.js'],
        bundle: true,
        outfile: 'dist/compile-ssr.js',
        format: 'cjs',
        platform: 'node',
        plugins: [
            esbuildSvelte({
                compilerOptions: { generate: 'server' }
            })
        ]
    });

    console.log("🚀 Generating static HTML...");
    const { execSync } = await import('child_process');
    execSync('node dist/compile-ssr.js', { stdio: 'inherit' });
}

build().catch(console.error);
