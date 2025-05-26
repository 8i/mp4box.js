import { FullBox } from '#/box';
import type { MultiBufferStream } from '#/buffer';
import type { SubSample } from '@types';

interface SampleInfo {
  size: number;
  subsamples: SubSample[];
  InitializationVector: Uint8Array;
}

const Per_Sample_IV_Size = 8; // hard-code for now

export class sencBox extends FullBox {
  type = 'senc' as const;
  box_name = 'SampleEncryptionBox';
  entries: SampleInfo[];
  parse(stream: MultiBufferStream) {
    // this.parseFullHeader(stream);
    let entry_count = stream.readUint32();
    this.entries = [];
    let subsample_count;
    for (let i = 0; i < entry_count; i++) {
      let sample = {} as SampleInfo;
      this.entries[i] = sample;
      sample.subsamples = [];

      // tenc.default_Per_Sample_IV_Size or seig.Per_Sample_IV_Size
      sample.InitializationVector = stream.readUint8Array(Per_Sample_IV_Size*8);
      if (this.flags & 0x2) {
        subsample_count = stream.readUint16();
        for (let j = 0; j < subsample_count; j++) {
          let subsample = {} as SubSample;
          subsample.BytesOfClearData = stream.readUint16();
          subsample.BytesOfProtectedData = stream.readUint32();
          sample.subsamples.push(subsample);
        }
      }
    }
  }
} 
