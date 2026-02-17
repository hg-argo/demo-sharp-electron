# Electron Forge ft. Sharp issue

This is a repro repository for an issue regarding Electron Forge and Sharp library.

## Objective

Make a desktop Electron app for Windows and MacOS able to process images using the Sharp library.

## Problem

Running the application as developer (with `npm run start`) works as expected. You will see an image being generated in `public/sharp-image.png`.

To build the app, you can use `npm run make`, and eveything seems fine. But when you open the resulting application executable, you will see this error:

![Error on MacOS](./info/sharp-error-macos.png)