import {useEffect, useRef} from "react";
import {useStore} from "@nanostores/react";
import {viewIndex} from "../../components/store/rootLayoutStore.ts";
import arknightsConfig from "../../../arknights.config.tsx";
import RootPageViewTemplate from "./RootPageViewTemplate.tsx";
import Index from "./00-Index.tsx";
import Information from "./01-Information.tsx";
import Operator from "./02-Operator.tsx";
import World from "./03-World.tsx";
import Media from "./04-Media.tsx";
import More from "./05-More.tsx";

export default function RootPageViews() {
    const $viewIndex = useStore(viewIndex)

    // 首次挂载组件通过当前锚点设置 viewIndex
    useEffect(() => {
        const HASH = location.hash.split("#")[1];
        const INDEX = arknightsConfig.navbar.items.findIndex(item =>
            HASH === item.href.split("#")[1])
        viewIndex.set(INDEX === -1 ? 0 : INDEX)
    }, [])

    // 上次鼠标滚轮使用时间戳
    const lastScrollTime = useRef(0);

    // 监听鼠标滚轮修改 viewIndex；限制修改间隔为一秒；
    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (performance.now() - lastScrollTime.current > 1000) {
                let newIndex: number
                if (event.deltaY < 0)
                    newIndex = $viewIndex > 0 ? $viewIndex - 1 : $viewIndex
                else
                    newIndex = $viewIndex < arknightsConfig.navbar.items.length - 1 ? $viewIndex + 1 : $viewIndex

                location.hash = arknightsConfig.navbar.items[newIndex].href.split("#")[1]
                viewIndex.set(newIndex)
                lastScrollTime.current = performance.now();
            }
        }

        document.getElementById("root-page-views")!.addEventListener("wheel", handleScroll)
        return () => document.getElementById("root-page-views")!.removeEventListener("wheel", handleScroll);
    }, [$viewIndex])

    // 监听锚点链接改变修改 viewIndex
    useEffect(() => {
        const handleHashChange = (hce: HashChangeEvent) => {
            const index: number = arknightsConfig.navbar.items.findIndex(item =>
                item.href.split("#")[1] === window.location.hash.split("#")[1])
            viewIndex.set(index === -1 ? 0 : index)
        }

        window.addEventListener("hashchange", handleHashChange)
        return () => window.removeEventListener("hashchange", handleHashChange)
    }, [])


    return [Index, Information, Operator, World, Media, More].map((Element, index) =>
        <RootPageViewTemplate key={index} selfIndex={index}><Element/></RootPageViewTemplate>)
}