import { Card, CardContent, Typography, Box } from "@mui/material";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function ActionCard({
  title,
  description,
  icon,
  onClick,
}: ActionCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer border-2 border-transparent hover:border-black transition-all duration-200 h-full group"
    >
      <CardContent className="p-6">
        <Box className="mb-4 text-slate-400 group-hover:text-black transition-colors">
          {icon}
        </Box>
        <Typography variant="h6" className="font-bold mb-1">
          {title}
        </Typography>
        <Typography variant="body2" className="text-slate-500">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
