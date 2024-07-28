const express = require('express');
const functions = require('firebase-functions');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');

const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    function chooseShape(agent) {
        const payloadJson = {
            "type": "template",
            "altText": "กรุณาเลือกประเภทของรูปทรง",
            "template": {
                "type": "buttons",
                "title": "เลือกประเภทของรูปทรง",
                "text": "กรุณาเลือกประเภทของรูปทรงที่คุณต้องการคำนวณพื้นที่",
                "actions": [
                    {
                        "type": "message",
                        "label": "สี่เหลี่ยมผืนผ้า",
                        "text": "สี่เหลี่ยมผืนผ้า"
                    },
                    {
                        "type": "message",
                        "label": "สามเหลี่ยมด้านเท่า",
                        "text": "สามเหลี่ยมด้านเท่า"
                    },
                    {
                        "type": "message",
                        "label": "วงกลม",
                        "text": "วงกลม"
                    }
                ]
            }
        };

        agent.add(new Payload(agent.LINE, payloadJson, { sendAsMessage: true }));
    }

    function calculateArea(agent) {
        const shape = agent.parameters.shape;
        const length = agent.parameters.length;
        const width = agent.parameters.width;
        const side = agent.parameters.side;
        const radius = agent.parameters.radius;

        if (shape === 'สี่เหลี่ยมผืนผ้า' && length && width) {
            const area = length * width;
            agent.add(`พื้นที่ของสี่เหลี่ยมผืนผ้าคือ ${area} ตารางหน่วย`);
        } else if (shape === 'สามเหลี่ยมด้านเท่า' && side) {
            const area = (Math.sqrt(3) / 4) * Math.pow(side, 2);
            agent.add(`พื้นที่ของสามเหลี่ยมด้านเท่าคือ ${area.toFixed(2)} ตารางหน่วย`);
        } else if (shape === 'วงกลม' && radius) {
            const area = Math.PI * Math.pow(radius, 2);
            agent.add(`พื้นที่ของวงกลมคือ ${area.toFixed(2)} ตารางหน่วย`);
        } else {
            agent.add(`กรุณาระบุค่าที่ต้องการคำนวณ`);
        }
    }

    let intentMap = new Map();
    intentMap.set('ChooseShapeIntent', chooseShape);
    intentMap.set('CalculateAreaIntent', calculateArea);
    agent.handleRequest(intentMap);
});

// เริ่มเซิร์ฟเวอร์ที่พอร์ตที่กำหนด
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
