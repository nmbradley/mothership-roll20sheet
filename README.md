# Mothership Roll20 Character Sheet
A repository and issue tracking location for Tuesday Knight Games' Mothership RPG sheet for Roll20

## Current Status

- Mothership Core PC sheet completed.
- Ship Sheet.

## Usage

This character sheet requires a modern web browser, such as the latest version of Chrome or Firefox to get the full experience. 

## Roadmap

- NPC & Hirelings Sheet
- Charactermancer

## Compiling

This sheet uses the [Pug](https://pugjs.org) HTML templating engine, and Sass's [SCSS](https://sass-lang.com/) pre-processor. You'll need to install both to update the sheet.

### Compiling Pug

Compile Pug into HTML with the following command from the base directory: 

`pug src/pug/mothership.pug --out . -P -w`

### Compiling the SCSS

Compile the SCSS into CSS with the following command from the base directory:

`sass src/scss/mothership.scss mothership.css --no-source-map --watch`
