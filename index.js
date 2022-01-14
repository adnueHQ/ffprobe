const stream = require('stream'),
	JSONStream = require('JSONStream'),
	Deferred = require('deferential'),
	bl = require('bl'),
	spawn = require('child_process').spawn,
	path = require('./filePath').ffprobePath;

export default getInfo;
function getInfo(filePath, cb) {
	const params = [];
	params.push('-show_streams', '-print_format', 'json', filePath);

	const d = Deferred();
	let info;
	let stderr;

	const ffprobe = spawn(path, params);
	ffprobe.once('close', function (code) {
		if (!code) {
			d.resolve(info);
		} else {
			var err = stderr.split('\n').filter(Boolean).pop();
			d.reject(new Error(err));
		}
	});

	ffprobe.stderr.pipe(bl(function (err, data) {
		stderr = data.toString();
	}));

	ffprobe.stdout
		.pipe(JSONStream.parse())
		.once('data', function (data) {
			info = data;
		});

	return d.nodeify(cb);
}
