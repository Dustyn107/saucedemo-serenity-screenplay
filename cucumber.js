module.exports = {
    default: {
        format: ['@serenity-js/cucumber'],
        formatOptions: { specDirectory: 'features' },
        requireModule: ['ts-node/register'],
        require: ['features/support/**/*.ts', 'features/step-definitions/**/*.ts'],
        paths: ['features/**/*.feature'],
    },
};
