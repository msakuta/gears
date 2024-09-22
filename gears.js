let gears = [];

window.onload = () => {
    const gearA = new Gear(8, [32, 32], 16, 20, 0.01);
    gears.push(gearA);
    const dist = gearA.innerRadius + 25;
    const angle = Math.PI / 3.;
    const gearB = new Gear(10, [
        gearA.center[0] + Math.cos(angle) * dist,
        gearA.center[1] + Math.sin(angle) * dist],
        20, 25, -0.007, Math.PI / 32);
    gears.push(gearB);
    const dist2 = gearB.innerRadius + 30;
    const angle2 = -Math.PI / 6.;
    const gearC = new Gear(10, [
        gearB.center[0] + Math.cos(angle2) * dist2,
        gearB.center[1] + Math.sin(angle2) * dist2], 26, 30, 0.007);
    gears.push(gearC);
    requestAnimationFrame(animate);
};

function animate() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let gear of gears) {
        gear.render(ctx);
        gear.tick();
    }
    requestAnimationFrame(animate);
}

class Gear {
    constructor(cogs, center, innerRadius, outerRadius, omega, phase=0) {
        this.cogs = cogs;
        this.center = center;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.omega = omega;
        this.phase = phase;
    }

    tick() {
        this.phase += this.omega;
    }

    render(ctx) {
        if (this.cogs === 0) return;
        const cuts = this.cogs * 2;
        const {center, innerRadius, outerRadius, phase} = this;

        ctx.beginPath();
        ctx.ellipse(center[0], center[1], 2, 2, 0, 0, Math.PI * 2, true);
        ctx.stroke();

        const circleCuts = [...Array(cuts)].map((_, i) => [
            Math.cos(i * Math.PI * 2 / cuts + phase),
            Math.sin(i * Math.PI * 2 / cuts + phase),
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