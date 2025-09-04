module.exports = {
    apps: [
        {
            name: 'streamfi-frontend',
            script: 'npm run dev'
        }
    ],

    deploy: {
        production: {
            user: 'root',
            host: '84.32.22.56',
            ref: 'origin/main',
            repo: 'https://github.com/Cyberdeus-ai/streamfi-frontend.git',
            path: '~/streamfi-frontend',
            'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --name FRONTEND'
        },
    },
};
