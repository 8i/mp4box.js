BoxParser.createFullBoxCtor("senc", function(stream) {
	// this.parseFullHeader(stream);
	var sample_count = stream.readUint32();
	this.samples = [];
	for (var i = 0; i < sample_count; i++) {
		var sample = {};
		// tenc.default_Per_Sample_IV_Size or seig.Per_Sample_IV_Size
		var Per_Sample_IV_Size = 8; // hard-code for now
		sample.InitializationVector = stream.readUint8Array(Per_Sample_IV_Size);
		if (this.flags & 0x2) {
			sample.subsamples = [];
			subsample_count = stream.readUint16();
			for (var j = 0; j < subsample_count; j++) {
				var subsample = {};
				subsample.BytesOfClearData = stream.readUint16();
				subsample.BytesOfProtectedData = stream.readUint32();
				sample.subsamples.push(subsample);
			}
		}
		// TODO
		this.samples.push(sample);
	}
});
