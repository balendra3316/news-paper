import { useEffect, useState } from "react";
import { getCampaignSummary } from "../../api/analytics.api";

export default function CampaignSummary({
  campaignId,
}: {
  campaignId: string;
}) {
  const [opens, setOpens] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    getCampaignSummary(campaignId).then((res) => {
      res.data.forEach((r: any) => {
        if (r.event_type === "OPEN") setOpens(Number(r.count));
        if (r.event_type === "CLICK") setClicks(Number(r.count));
      });
    });
  }, [campaignId]);

  const ctr = opens ? ((clicks / opens) * 100).toFixed(2) : "0";

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white border rounded">
        <div className="text-gray-500 text-sm">Total Opens</div>
        <div className="text-2xl font-semibold">{opens}</div>
      </div>

      <div className="p-4 bg-white border rounded">
        <div className="text-gray-500 text-sm">Total Clicks</div>
        <div className="text-2xl font-semibold">{clicks}</div>
      </div>

      <div className="p-4 bg-white border rounded">
        <div className="text-gray-500 text-sm">CTR</div>
        <div className="text-2xl font-semibold">{ctr}%</div>
      </div>
    </div>
  );
}
