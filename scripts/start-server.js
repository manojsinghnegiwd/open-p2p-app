const { spawn } = require("child_process");
const chalk = require("chalk");

const executeCommand = (title, command) => {
    const frontendServer = spawn(command, {
        shell: true,
    });
    
    frontendServer.stdout.on("data", function (data) {
        console.log(`${chalk.green(`${title}:`)} ${data.toString()}`);
    });
    
    frontendServer.stderr.on("data", function (data) {
        console.log(`${chalk.red(`${title}:`)} ${data.toString()}`);
    });
    
    frontendServer.on("exit", function (code) {
        console.log(`${chalk.red("child process exited with code: ")} ${code.toString()}`);
    });
}

executeCommand('frontend server', "HOST=0.0.0.0 cd frontend && yarn start")
executeCommand('backend server', "cd backend && yarn dev")
