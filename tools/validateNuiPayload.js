#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function usage() {
  console.log('Usage: node tools/validateNuiPayload.js <side> <action> [topic] <json-file>');
  console.log("side: 'lua_to_nui' or 'nui_to_lua'");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length < 3) usage();

const side = args[0];
const action = args[1];
let topic = null;
let jsonFile = null;
if (args.length === 3) {
  jsonFile = args[2];
} else if (args.length === 4) {
  topic = args[2];
  jsonFile = args[3];
} else {
  usage();
}

const nuiEventsPath = path.resolve(process.cwd(), 'nui-events.json');
if (!fs.existsSync(nuiEventsPath)) {
  console.error('nui-events.json not found in repo root');
  process.exit(2);
}

const nuiEvents = JSON.parse(fs.readFileSync(nuiEventsPath, 'utf8'));
if (!nuiEvents[side] || !nuiEvents[side][action]) {
  console.error(`No schema found for side='${side}' action='${action}'`);
  process.exit(3);
}

let schema = nuiEvents[side][action];

// Determine payload schema
let payloadSchema = null;
if (topic) {
  if (!schema.payload) {
    console.error('Schema has no payload field');
    process.exit(4);
  }
  // some schemas have payload.topic mapping
  if (schema.payload[topic]) {
    payloadSchema = schema.payload[topic];
  } else {
    console.error(`No payload schema for topic='${topic}'`);
    process.exit(5);
  }
} else {
  payloadSchema = schema.payload;
}

// Read JSON to validate
let obj = null;
try {
  const raw = fs.readFileSync(path.resolve(process.cwd(), jsonFile), 'utf8');
  obj = JSON.parse(raw);
} catch (err) {
  console.error('Failed to read/parse JSON file:', err.message);
  process.exit(6);
}

function checkType(expected, value) {
  if (expected === 'number') return typeof value === 'number';
  if (expected === 'boolean') return typeof value === 'boolean';
  if (expected === 'string') return typeof value === 'string';
  if (expected === 'object') return typeof value === 'object' && value !== null;
  // wildcard / textual schemas we don't validate
  return true;
}

function validate(schemaDef, objValue, pathPrefix = '') {
  const errors = [];
  if (schemaDef == null) {
    // no payload expected
    if (objValue && Object.keys(objValue).length) {
      errors.push(`${pathPrefix} - unexpected payload`);
    }
    return errors;
  }

  if (typeof schemaDef === 'string') {
    // simple type or description
    if (schemaDef === 'object' || schemaDef === 'number' || schemaDef === 'boolean' || schemaDef === 'string') {
      if (!checkType(schemaDef, objValue)) {
        errors.push(`${pathPrefix} - expected ${schemaDef}, got ${typeof objValue}`);
      }
    }
    // else we treat textual descriptors as non-strict
    return errors;
  }

  // if schemaDef is an object mapping keys -> type or nested object
  for (const [k, v] of Object.entries(schemaDef)) {
    const keyPath = pathPrefix ? `${pathPrefix}.${k}` : k;
    if (!(k in objValue)) {
      errors.push(`${keyPath} - missing`);
      continue;
    }
    const val = objValue[k];
    if (typeof v === 'string') {
      if (!checkType(v, val)) {
        errors.push(`${keyPath} - expected ${v}, got ${typeof val}`);
      }
    } else if (typeof v === 'object') {
      // nested schema
      errors.push(...validate(v, val, keyPath));
    }
  }
  return errors;
}

const errors = validate(payloadSchema, obj);
if (errors.length === 0) {
  console.log('VALID: payload conforms to schema');
  process.exit(0);
} else {
  console.error('INVALID payload:');
  for (const e of errors) console.error(' -', e);
  process.exit(7);
}
