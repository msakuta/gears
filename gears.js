let gears = [];

window.onload = () => {
    const gearA = new Gear(8, [32, 32], 16, 20, 0.01);
    gears.push(gearA);
    const dist = gearA.innerRadius + 25;
    const angle = Math.PI / 3.;
    const gearB = new Gear(10, [
        gearA.center[0] + Math.cos(angle) * dist,
        gearA.center[1] + Math.sin(angle) * dist],
        20, 25, 0, Math.PI / 64);
    gearB.link(gearA);
    gears.push(gearB);
    const dist2 = gearB.innerRadius + 34;
    const angle2 = -Math.PI / 6.;
    const gearC = new Gear(14, [
        gearB.center[0] + Math.cos(angle2) * dist2,
        gearB.center[1] + Math.sin(angle2) * dist2],
        30, 34);
    gearC.link(gearB);
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
    constructor(cogs, center, innerRadius, outerRadius, omega=0, phase=0) {
        this.cogs = cogs;
        this.center = center;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.omega = omega;
        this.phase = phase;
    }

    averageRadius() {
        return (this.innerRadius + this.outerRadius) / 2;
    }

    link(otherGear) {
        this.omega = -otherGear.omega * otherGear.cogs / this.cogs;
    }

    tick() {
        this.phase += this.omega;
    }

    render(ctx) {
        if (this.cogs === 0) return;
        const cuts = this.cogs * 2;
        const {center, innerRadius, outerRadius, phase} = this;

        this.renderPinHole(ctx);

        const circleCuts = [...Array(cuts)].map((_, i) => [
            Math.cos(i * Math.PI * 2 / cuts + phase),
            Math.sin(i * Math.PI * 2 / cuts + phase),
        ]);

        ctx.beginPath();
        for (let i = 0; i <= circleCuts.length; i++) {
            const pt = circleCuts[i % circleCuts.length];
            if (i % 2 === 0) {
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

    renderPinHole(ctx) {
        const {center, phase} = this;
        const numPinVertices = 16;
        const pinVertices = [...Array(numPinVertices)].map((_, i) => [
            Math.cos(i * Math.PI * 2 / numPinVertices),
            Math.sin(i * Math.PI * 2 / numPinVertices),
        ]);
        const pinInnerRadius = 5;
        const pinOuterRadius = 9;
        const rotMat = [
            Math.cos(phase), -Math.sin(phase),
            Math.sin(phase), Math.cos(phase),
        ];

        const pt0 = pinVertices[0];
        const pt1 = pinVertices[pinVertices.length - 1];
        ctx.beginPath();
        const pt1Trans = applyMatrix(rotMat, [pt1[0] * pinInnerRadius, pt1[1] * pinInnerRadius]);
        ctx.moveTo(pt1Trans[0] + center[0], pt1Trans[1] + center[1]);
        const ptKey1Trans = applyMatrix(rotMat, [pinOuterRadius, pt1[1] * pinInnerRadius]);
        ctx.lineTo(ptKey1Trans[0] + center[0], ptKey1Trans[1] + center[1]);
        const ptKey0Trans = applyMatrix(rotMat, [pinOuterRadius, -pt1[1] * pinInnerRadius]);
        ctx.lineTo(ptKey0Trans[0] + center[0], ptKey0Trans[1] + center[1]);
        for (let i = 1; i < pinVertices.length; i++) {
            const pt = pinVertices[i % pinVertices.length];
            const ptTrans = applyMatrix(rotMat, [pt[0] * pinInnerRadius, pt[1] * pinInnerRadius]);
            ctx.lineTo(ptTrans[0] + center[0], ptTrans[1] + center[1]);
        }
        ctx.stroke();
    }
}

function applyMatrix(mat, vec) {
    return [
        mat[0] * vec[0] + mat[1] * vec[1],
        mat[2] * vec[0] + mat[3] * vec[1],
    ]
}