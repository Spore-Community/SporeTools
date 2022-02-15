# Spore Tools
https://tools.sporecommunity.com

A collection of useful tools for Spore, a 2008 video game from Maxis.

The tools are written in TypeScript, and are largely targeted towards mod developers, but have a variety of uses.

The tools are all usable in a web browser. Most of the code is organized into ES Modules for reusability in other websites or applications.

#

## Tools
### Asset Tool
https://tools.sporecommunity.com/asset

This tool allows you to enter a Spore.com asset ID or upload a Spore creation PNG, and obtain all available data from both the official Spore server and the data embedded in the PNG.

### Hash Tool (WIP)
https://tools.sporecommunity.com/hash

This tool lets you enter a string, and get its corresponding FNV hash, as used in the game's package files.

#

## Services and external code used

### Spore API
https://www.spore.com/comm/developer/

Spore.com data is retrieved using the official Spore API. Due to CORS limitations, the API is proxied through Cloudflare Workers.

### UPNG
https://github.com/photopea/UPNG.js/

UPNG is a PNG decoder. It is used to decode Spore creation PNGs from the image data.

### pako / zlib
https://github.com/nodeca/pako

Pako is a zlib port. It is used to decompress the data stored inside Spore creation PNGs.

#

## Contact
If you need any help, join our Discord at https://discord.gg/66jVk3X, or email kade@sporecommunity.com

#
*Not associated with or endorsed by Electronic Arts or Maxis.*
