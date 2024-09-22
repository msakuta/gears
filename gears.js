let gears = [];

window.onload = () => {
    gears.push(new Gear(8, [32, 32], 16, 20, 0.01));
    gears.push(new Gear(10, [64, 50], 20, 25, -0.007));
    requestAnimationFrame(animate);
};

function animate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (gear of gears) {
        gear.render(ctx);
        gear.tick();
    }
    requestAnimationFrame(animate);
}

class Gear {
    constructor(cogs, center, innerRadius, outerRadius, omega) {
        this.cogs = cogs;
        this.center = center;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.omega = omega;
        this.angle = 0;
    }

    tick() {
        this.angle += this.omega;
    }

    render(ctx) {
        if (this.cogs === 0) return;
        const cuts = this.cogs * 2;
        const {center, innerRadius, outerRadius, angle} = this;
        const circleCuts = [...Array(cuts)].map((_, i) => [
            Math.cos(i * Math.PI * 2 / cuts + angle),
            Math.sin(i * Math.PI * 2 / cuts + angle),
        ]);

        const pt0 = circleCuts[0];
        ctx.beginPath();
        // ctx.moveTo(pt0 * innerRadius + center[0], pt0 * innerRadius + center[1]);
        for (let i = 0; i <= circleCuts.length; i++) {
            const pt = circleCuts[i % circleCuts.length];
            if (i % 2 == 0) {
                ctx.lineTo(pt[0] * innerRadius + center[0], pt[1] * innerRadius + center[1]);
                ctx.lineTo(pt[0] * outerRadius + center[0], pt[1] * outerRadius + center[1]);
            }
            else {
                ctx.lineTo(pt[0] * outerRadius + center[0], pt[1] * outerRadius + center[1]);
                ctx.lineTo(pt[0] * innerRadius + center[0], pt[1] * innerRadius + center[1]);
            }
        }
        ctx.stroke();
    }
}