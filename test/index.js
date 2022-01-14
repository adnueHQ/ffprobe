import { filePath as _path } from '../filePath';
import expect from 'expect.js';
import { join } from 'path';
import ffprobe from '..';

function fixture(fileName) {
  return join(__dirname, 'fixtures', fileName);
}

describe('ffprobe', function () {
  it('should be able to list info as JSON', function (done) {
    ffprobe(fixture('test.jpg'), { path: _path }, function (err, info) {
      if (err) return done(err);
      expect(info.streams[0].codec_name).to.equal('mjpeg');
      expect(info.streams[0].width).to.equal(175);
      expect(info.streams[0].height).to.equal(174);
      done();
    });
  });

  it('should also export a Promise API (success)', function (done) {
    ffprobe(fixture('test.jpg'), { path: _path })
      .then(function (info) {
        expect(info.streams[0].codec_name).to.equal('mjpeg');
        expect(info.streams[0].width).to.equal(175);
        expect(info.streams[0].height).to.equal(174);
        done();
      })
      .catch(function (err) {
        setImmediate(function () {
          done(err);
        });
      });
  });

  it('should also export a Promise API (failure)', function (done) {
    ffprobe(fixture('not-here.jpg'), { path: _path })
      .then(function (info) {
        done(new Error('Unexpected info: ' + JSON.stringify(info)));
      })
      .catch(function (err) {
        expect(err.message).to.contain('No such file or directory');
        done();
      });
  });
});
