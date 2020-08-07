import { downloadStream } from "./engine/message";
import { getRoomArrInfo } from "./util/utils";
import { StreamInfo } from "type/getStreamInfo";
import { getStreamUrl } from "./engine/getStreamUrl";
import { liveStreamStatus } from "./engine/liveStreamStatus"
//0 不在线 1 在线
let pool: any = []
let RoomIds = getRoomArrInfo(require('../templates/info.json').streamerInfo);
const timer = setInterval(() => {
    // console.log(liveStatus)
    // console.log(RoomIds)
    for (let RoomId of RoomIds) {
        getStreamUrl(RoomId.roomTitle, RoomId.roomLink, RoomId.roomTags)
            .then((stream: StreamInfo) => {
                // console.log(stream)
                if (liveStreamStatus.get(RoomId.roomLink) !== 1) {
                    liveStreamStatus.set(RoomId.roomLink, 1)
                    pool.push(stream)
                }
            })
            .catch(() => {
                // console.log(err)
                liveStreamStatus.set(RoomId.roomLink, 0)
            });
    }
    if (pool.length >= 1) {
        downloadStream(pool.pop())
    }
}, 30000);
process.on("SIGINT", () => {
    console.log("接收到退出指令，清除定时器\n进程退出，稿件需要手动上传")
    clearInterval(timer)
})