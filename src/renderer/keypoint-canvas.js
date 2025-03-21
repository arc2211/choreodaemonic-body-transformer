export class KeypointCanvas {
    constructor(container, scaling) {
        this.container = container;
        this.ctx = container.getContext("2d");
        this.scaling = scaling;
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

            // Draw keypoint circle
            this.ctx.beginPath();
            this.ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.closePath();

            // Draw label.
            this.ctx.fillStyle = "#aaa";
            this.ctx.font = "14px Arial";
            this.ctx.textAlign = "center";
            let keypointName = robotJoints.mappings[i];
            let isOdd = i % 2 === 1;
            let labelOffset = isOdd ? -10 : 20;
            this.ctx.fillText(keypointName, canvasX, canvasY + labelOffset);
        }
    }
}
