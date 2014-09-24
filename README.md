A nodejs file organization tool.

##Why organize.js?

I began a large project to organize personal photos and videos over the last 14 years.  I really wanted the ability to sort photos and video into chronological directory structure.  There is existing software options out there, but I thought it would be fun to write my own.  Organize.js works by copying files of a certain type from a source directory into a destination that is decided based on a pattern.  Under the hood, organize.js is asychronously stream up to 10 files as a time until the job is done.  I've used it to sort up over 2,000 files in a single job.  

##Disclaimer
I've only tested this on Mac machine with an external hard drive. 

##Usage:

Command Line w/ params:

```node organize.js --from="." --to="[Photos]/YYYY/MM-MMMM" --types="jpg,jpeg,gif,png"```

This will take files with the extension jpg, jpeg, gif, or png from the current directory and move them to the "Photos" directory and then into sub-folders based on the date of the file.  For example, if the files date is from February 2012, then the file would be moved to "Photos/2012/02-February/".

The date placeholders are parsed by [moment.js](http://momentjs.com/).  Read the moment.js documentation for supported tokens.

Command line w/ config.json

node organize.js 

-- assuming your have a config.json file in the same directory as organize.js

Example config.json

```javascript
[
    {
      "from" : "/drive/import",  
      "types": "mp4,3pg,mov,avi,mpg,mov,mp4",
      "to": "/drive/[Video]/YYYY/MM-MMMM",
      "recursive": true,
      "move": true,
      "dryrun": false
    }
]
```

## Parameters

Parameter  | Description
------------- | -------------
from      | (required) The full path of the source directory
to        | (required) The full path of the destination directory
types     | (required) the file types that apply to each job
recursive | (optional, default = true) when true digs into and processes subdirectories
move      | (optional, default = false) deletes the source file after copying to the destination
dryrun    | (optional, default = false) allows you to see where files will go, but doesn't actually process them

## Credits

  - [Michael Bosworth](http://github.com/bozzltron)

## License

(The MIT License)

Copyright (c) 2014 Michael Bosworth

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
