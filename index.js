#!/usr/bin/env node
import {gatherInputsAndMigrate} from "./src/migrationSteps.js";

await gatherInputsAndMigrate();