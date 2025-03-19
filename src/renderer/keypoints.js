export class Keypoints {
    constructor(keypointNames) {
        /*
            {
                "nose": {
                    x: 0.2,
                    y: 0.7
                },

                "left elbow": {
                    x: 0.0,
                    y: 0.92
                }
            }
         */
        this.model = {};
        this.keypointNames = keypointNames;
    }

    isValidKeypoint(x, y) {
        if (isNaN(x) || isNaN(y)) {
            return false;
        }

        return true;
    }

    update(poseMessage) {

        // // read new Bundled Message Per Axis format 
        if(poseMessage[0] && poseMessage[1]){
            let xValues = poseMessage[0].args.map(x => x.value);
            let yValues = poseMessage[1].args.map(y => y.value);
        
            for (let i = 0; i < this.keypointNames.length; i++) {
                let keypointName = this.keypointNames[i];
                let x = 1.0 - xValues[i]; // Flip x coordinate 
                let y = yValues[i];
        
                if (this.isValidKeypoint(x, y)) {
                    this.model[keypointName] = {
                        x: x,
                        y: y
                    }
                }
            }
        }

        // old format of messages 
        // for (let i = 0; i < poseMessage.args.length; i++) {
        //     let keypointCoordinates = poseMessage.args[i];
        //     let keypointName = this.keypointNames[i];
        //     let x = 1.0 - keypointCoordinates[0].value;
        //     let y = keypointCoordinates[1].value;
        //     let keypoint = {
        //         x: x,
        //         y: y
        //     };

        //     if (this.isValidKeypoint(x, y)) {
        //         this.model[keypointName] = {
        //             x: x,
        //             y: y
        //         }
        //     }
        // }
    }
}
