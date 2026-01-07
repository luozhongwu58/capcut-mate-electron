import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import electronService from "../../services/electronService";
import ExternalWebpage from "../../components/ExternalWebpage";
import Textarea from "../../components/Textarea";
import Tabs from "../../components/Tabs";
import DownloadControls from "../../components/DownloadControls";
import DownloadButton from "../../components/DownloadButton";
import LogModule from "../../components/LogModule";

import "./index.css";

// 默认服务器地址（可在配置中心修改）
const DEFAULT_API_BASE = "https://jianying.guangyingai.cn/openapi/capcut-mate/v1/get_draft";

function MainPage() {
  const [textareaValue, setTextareaValue] = useState("");
  const [isDownloadOpen, setIsDownloadOpen] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 外层容器的ref，用于实现自动滚动
  const downloadPageRef = useRef(null);

  // 加载配置
  useEffect(() => {
    // 监听日志更新
    electronService.onFileOperationLog((logEntry) => {
      setLogs((prevLogs) => [...prevLogs, logEntry]);
    });

    return () => {
      try {
        electronService.removeAllFileOperationLogListeners();
      } catch (error) {
        console.error("取消订阅日志失败:", error);
      }
    };
  }, []);

  // 当日志更新时，将外层容器滚动到底部
  useEffect(() => {
    if (downloadPageRef.current) {
      downloadPageRef.current.scrollTop = downloadPageRef.current.scrollHeight;
    }
  }, [logs]);

  const handleDownload = async () => {
    if (!textareaValue) {
      toast.warn("请输入草稿地址或草稿ID，多个使用回车换行分隔");
      return;
    }

    const valArray = textareaValue.split("\n").map((line) => line.trim());
    for (const val of valArray) {
      if (val) {
        await saveFile(val);
      }
    }
  };

  const saveFile = async (value) => {
    let fullUrl = value;
    let targetId = value;

    // 判断是否为完整URL
    if (!value.startsWith('http')) {
      // 只输入了ID，自动拼接完整URL
      fullUrl = `${DEFAULT_API_BASE}?draft_id=${value}`;
      targetId = value;
      console.log(`自动拼接URL: ${fullUrl}`);
    } else {
      // 是完整URL，从中提取draft_id
      const urlParams = new URLSearchParams(
        value.includes("?") ? value.split("?")[1] : ""
      );
      targetId = urlParams.get("draft_id");
    }

    if (!targetId) {
      toast.warn(`${value} 中缺少 draft_id 参数`);
      return;
    }

    try {
      const jsonData = await electronService.getUrlJsonData(fullUrl);
      if (jsonData?.code !== 0 || !jsonData?.files) {
        toast.error("获取文件列表失败，请确保您输入的地址可正常访问");
        return;
      }

      const matchedFiles = jsonData.files.filter((fileUrl) =>
        fileUrl.includes(targetId)
      );

      if (matchedFiles.length === 0) {
        toast.error("未找到包含 draft_id 的文件");
        return;
      }

      setLogs([]);

      await electronService.saveFile({
        sourceUrl: fullUrl,
        remoteFileUrls: matchedFiles,
        targetId,
        isOpenDir: isDownloadOpen,
      });
      toast.success(`剪映草稿下载完成！请前往剪映查看`);
    } catch (error) {
      toast.error("保存文件失败", error);
    }
  };

  const handleClearLogs = () => setLogs([]);

  return (
    <div className="download-page" ref={downloadPageRef}>
      <div className="container">
        <ExternalWebpage />

        <Textarea
          value={textareaValue}
          onChange={(val) => setTextareaValue(val?.trim())}
        />

        <Tabs
          onTabChange={(content) => setTextareaValue(content)}
          initialContent={textareaValue}
        />

        <DownloadControls
          isOpen={isDownloadOpen}
          isLoading={isLoading}
          onToggle={setIsDownloadOpen}
        />

        <DownloadButton
          onClick={handleDownload}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          textValue={textareaValue}
        />

        <LogModule logs={logs} onClear={handleClearLogs} />
      </div>
    </div>
  );
}

export default MainPage;
