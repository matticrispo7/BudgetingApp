import { program } from "commander";
import dotenv from "dotenv";
import { readFileSync } from "fs";

function assertPort(port, program, excode) {
  if (port <= 1024 || port > 65535) {
    console.error(`Invalid port (must be between 1025 and 65535): ${port}`);
    program.outputHelp();
    process.exit(excode);
  }
}

/**
 * Prepares the configuration from environment variables.
 * @return {{config: {iface: string, port: number, auth: boolean, oidc: {redirect: string, clientId: string, secret: string}}}} Configuration
 */
function configFromEnv() {
  dotenv.config();
  const cfg = {};
  process.env.IFACE ? (cfg.iface = process.env.IFACE) : (cfg.iface = "0.0.0.0");
  process.env.PORT ? (cfg.port = process.env.PORT) : (cfg.port = 8000);
  process.env.AUTH === false
    ? (cfg.auth = process.env.AUTH)
    : (cfg.auth = true);
  return cfg;
}

/**
 * Reads the command line and returns the parsed configuration.
 * @return {{config: {iface: string, port: number, auth: boolean, oidc: {redirect: string, clientId: string, secret: string}}}} Configuration
 */
export function parse() {
  const { version } = JSON.parse(readFileSync("./package.json"));

  // generic properties
  program
    .version(version)
    .option(
      "-i, --iface <interface>",
      "The interface the service will listen to for requests",
      "0.0.0.0"
    )
    .option(
      "-p, --port <port>",
      "The port number the service will listen to for requests",
      (p) => parseInt(p, 10),
      8000
    )
    .option("-E, --no-env", "Ignores the .env file")
    .option("-A, --no-auth", "Disables authentication and authorization");

  // parses command line
  program.parse(process.argv);
  assertPort(program.port, program, 2);

  const config = configFromEnv();

  return { config };
}

export default parse;
