module.exports = {
    apps: [
        {
            name: 'frontend',
            script: 'npm run dev'
        }
    ],

    deploy: {
        production: {
            user: 'root',
            host: '84.32.131.44',
            ref: 'origin/main',
            repo: 'https://github.com/Cyberdeus-ai/streamfi-frontend.git',
            path: '/root/var/streamfi-frontend',
            'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --name FRONTEND'
        },
    },
};
