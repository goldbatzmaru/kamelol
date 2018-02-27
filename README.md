# kamelol
Kame Productions Blog

## Development
## Make sure you're running the latest node LTS version
You can check the LTS versions in https://github.com/nodejs/Release

## If need to upgrade node (example for node 8.9.4)
```
$ sudo npm cache clean -f
$ sudo npm install -g n
$ sudo n 8.9.4
```

## Install Ghost-CLI
```
$ npm install -g ghost-cli@latest
```

## Install Ghost local
On a new empty directory that will hold the ghost environment, run
```
$ ghost install local
```
This will output the local URL for the blog.

## Create ghost admin account
Go to your local URL's `localhost:PORT/ghost`, create an account.

## Upload the repo theme
Zip up this repo's type folder (`$ zip -r type.zip type`)

On the admin panel, go to Settings > Design, and click the Upload a Theme button. Upload the zipped file and select it as Active.

## Symlink the ghost's theme folder for the type theme to the repo folder
Go to `content/themes` inside your ghost installation folder, and delete the `type` theme's folder.

Create a symlink to the repo type's folder with `$ ln -s /path/to/this/repo/type /path/to/ghost/content/themes/type`.

You are ready to edit this repo's type folder and see the changes in `localhost:PORT`!
