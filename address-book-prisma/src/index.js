const { app, PORT } = require("./app");

app.listen(PORT, () => console.info(`Server listening on http://localhost:${PORT}`));