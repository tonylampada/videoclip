<template>
    <div>
        <video width="400" controls ref="video">
            <source :src="video_source" id="video_here">
        </video>

        <input type="file" name="file[]" class="file_multi_video" accept="video/*" @change="onSelectFile">

        <img width="150" height="100" v-for="src in img_srcs" :key="src" :src="src"/>
    </div>
</template>

<script>



export default {
  name: 'VideoClip',
  data () {
    return {
        video_source: '',
        img_srcs: [],
        img_src: ''
    }
  },
  methods: {
    onSelectFile(evt){
        // debugger
        this.video_source = URL.createObjectURL(evt.target.files[0])
        this.$refs.video.load()
        // this.load_image()
    },
    load_image() {
        const format = 'jpeg';
        const quality = 0.92;

        var canvas = document.createElement("CANVAS");
        const video = this.$refs.video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        var dataUri = canvas.toDataURL('image/' + format, quality);
        this.img_srcs.push(dataUri)
        // var data = dataUri.split(',')[1];
        // var mimeType = dataUri.split(';')[0].slice(5)

        // var bytes = window.atob(data);
        // var buf = new ArrayBuffer(bytes.length);
        // var arr = new Uint8Array(buf);

        // for (var i = 0; i < bytes.length; i++) {
        //     arr[i] = bytes.charCodeAt(i);
        // }

        // var blob = new Blob([ arr ], { type: mimeType });
        // return { blob: blob, dataUri: dataUri, format: format };    
    }
  },
  mounted() {

    let video_duration = 0
    let i = 0
    const _this = this

    function forwardvideo(){
        _this.$refs.video.currentTime += video_duration / 10;
        i += 1
    }

    this.$refs.video.addEventListener('loadeddata', () => {
        video_duration = this.$refs.video.duration
        forwardvideo()
    })
    this.$refs.video.addEventListener('seeked', () => {
        this.load_image()
        if (i < 10) {
            forwardvideo()
        }
    });
    //   video.currentTime = time;
    window.COMP = this
  }
}

</script>