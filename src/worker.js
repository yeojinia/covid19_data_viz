

export default () => {
    // eslint-disable-next-line no-restricted-globals
    self.addEventListener("message", e => {
        // eslint-disable-line no-restricted-globals
        if (!e) return;

        const users = [];

        postMessage(users);

    });
};