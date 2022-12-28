<template>
  <div>
    <video v-show="false" width="400" controls ref="video">
      <source :src="video_source" id="video_here" />
    </video>

    <input
      type="file"
      name="file[]"
      class="file_multi_video"
      accept="video/*"
      @change="onSelectFile"
    />

    <input
    type="text"
    name="textInput"
    v-model="textPrompt"
  />

  <button @click="buttonHandler">Show CLIP Similarity</button>

    
  <div>

    <div style="display:inline-block" v-for="(src, index) in img_srcs" :key="index">

        <img
        width="150"
        height="100"
        :src="src"
        :style="{opacity:image_opacity[index]}"
      />
      <p>{{index}}: {{img_similarities[index]}} </p>

    </div>

    
  </div>


  </div>
</template>

<script>

import async from "async";
import {clipEncodeImage, clipEncodeText, cosineSimilarity} from "../clipEncode.js";


export default {
  name: "VideoClip",
  data() {
    return {
      video_source: "",
      img_srcs: [],
      img_embeddings: [],
      img_similarities: [],
      image_opacity: [],
      textPrompt: "",
      textEmbedding: []
    };
  },
  methods: {
    onSelectFile(evt) {
      // debugger
      this.video_source = URL.createObjectURL(evt.target.files[0]);
      this.$refs.video.load();
      // this.load_image()
    },

    async buttonHandler(){
        console.log(this.textPrompt);
        this.textEmbedding = await clipEncodeText(this.textPrompt);

        this.computeSimilarity();


        

    },

    computeSimilarity(){
        console.log("similarity sanity check:", cosineSimilarity(this.textEmbedding, this.textEmbedding));
        const similarities = [];
        for (var i=0; i<this.img_embeddings.length; i++){
            similarities[i] = cosineSimilarity(this.img_embeddings[i], this.textEmbedding);
        }

        this.img_similarities = similarities;
        console.log("done computing similarity")
        
        const min  = Math.min(...similarities);
        const max  = Math.max(...similarities);

        for (let i=0; i<similarities.length; i++){
            this.image_opacity[i] = (similarities[i] - min) / (max - min);
        }

    },

    load_image() {
      const format = "jpeg";
      const quality = 0.92;

      var canvas = document.createElement("CANVAS");
      const video = this.$refs.video;
      canvas.width = 336 //video.videoWidth;
      canvas.height = 336 //video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, 336, 336);

      var dataUri = canvas.toDataURL("image/" + format, quality);
      this.img_srcs.push(dataUri);

    },
  },
  mounted() {
    let video_duration = 0;
    let i = 0;
    const _this = this;


    const NUM_FRAMES = 100;

    async function getClipVectors(){
        
        await async.eachOfLimit(_this.img_srcs, 100, async function(src, i) {
            const vector = await clipEncodeImage(src);
            _this.img_embeddings[i] = vector;
        });

        console.log("done");
    }


    
    function forwardvideo() {
      _this.$refs.video.currentTime += video_duration / NUM_FRAMES;
      i += 1;
    }

    this.$refs.video.addEventListener("loadeddata", () => {
      video_duration = this.$refs.video.duration;
      forwardvideo();
    });
    this.$refs.video.addEventListener("seeked", () => {
      this.load_image();
      if (i < NUM_FRAMES) {
        forwardvideo();
      }
      else{
        getClipVectors()
      }
    });
    //   video.currentTime = time;
    window.COMP = this;
  },
};
</script>
