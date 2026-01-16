import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: number;
  loading: boolean;
  onClick: () => void;
}

export default function StatCard({ title, value, loading, onClick }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer border-none shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 bg-white"
    >
      <CardContent className="p-5">
        <Box className="flex justify-between items-start">
          <div className="space-y-1">
            <Typography
              variant="overline"
              className="text-slate-500 font-bold tracking-wider"
            >
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={60} height={40} />
            ) : (
              <Typography variant="h4" className="font-black text-slate-800">
                {value}
              </Typography>
            )}
          </div>
          <ArrowForwardIos className="text-slate-300 group-hover:text-black transition-colors text-sm mt-2" />
        </Box>
      </CardContent>
    </Card>
  );
}
