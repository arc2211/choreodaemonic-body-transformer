export class KeypointCanvas {
    constructor(container, scaling) {
        this.container = container;
        this.ctx = container.getContext("2d");
        this.scaling = scaling;
    }

    jointLabel(keypointName, robotJoint) {
        let xStr = robotJoint[0].toFixed(3);
        let yStr = robotJoint[1].toFixed(3);

        return `${keypointName} (${xStr}, ${yStr})`
    }

    makeGraph() {

        let width = this.container.width;
        let height = this.container.height;

        // Draw grid lines
        this.ctx.strokeStyle = '#e9e9e9';
        this.ctx.lineWidth = 0.5;


        // Vertical lines for every meter
        let meterSpacingX = width / this.scaling.scaleX;
        for (let x = 0; x <= width; x += meterSpacingX) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }

        // Horizontal lines for every meter
        let meterSpacingY = height / this.scaling.scaleY;
        for (let y = 0; y <= height; y += meterSpacingY) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        // Draw origin labels
        this.ctx.fillStyle = 'gray';
        this.ctx.font = '10px monospace';

        // X-axis labels
        for (let x = 0; x <= width; x += meterSpacingX) {
            let meters = ((x - width/2) / width * this.scaling.scaleX).toFixed(1);
            this.ctx.fillText(meters + 'm', x - 10, height - 10);
        }

        // Y-axis labels (from bottom to top)
        for (let y = height; y >= 0; y -= meterSpacingY) {
            let meters = ((height - y) / height * this.scaling.scaleY).toFixed(1);
            this.ctx.fillText(meters + 'm', 10, y + 5);
        }

    }

    render(robotJoints) {
        let width = this.container.width;
        let height = this.container.height;
        this.ctx.clearRect(0, 0, width, height);
        this.makeGraph();

        for (let i = 0; i < robotJoints.model.length; i++) {
            let robotJoint = robotJoints.model[i];
            const canvasX = ((robotJoint[0] + this.scaling.scaleX/2) / this.scaling.scaleX ) * width;
            const canvasY = (1 - (robotJoint[1] / this.scaling.scaleY)) * height;


            let test = robotJoints.model[0];
            // console.log("joint:", test, " Rx: ", test[0], " Ry: ", test[1]);
            // console.log("x: ", ((test[0] + this.scaling.scaleX/2) / this.scaling.scaleX ) * width, " y: ", (1 - (test[1] / this.scaling.scaleY)) * height);


            // Draw keypoint circle
            this.ctx.beginPath();
            this.ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.fillStyle = "gray";
            this.ctx.font = "14px Arial";

            // Offset text slightly
            let keypointName = robotJoints.mappings[i];
            let jointLabel = this.jointLabel(keypointName, robotJoint);
            this.ctx.fillText(jointLabel, canvasX + 8, canvasY - 8);
        }
    }
}
