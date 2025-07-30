import { DynamicKeyObject } from "@/interfaces/app";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataset,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ICustomPieChartProps {
  labels: string[];
  datasets: ChartDataset<"doughnut", number[]>[];
  options?: DynamicKeyObject;
  onClick?: (event: any, elements: any[]) => void;
}

const INITIAL_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  cutout: '60%',
};

function CustomPieChart(props: ICustomPieChartProps) {
  const { labels, datasets, options = INITIAL_OPTIONS, onClick } = props;
  
  const chartOptions = {
    ...options,
    onClick: onClick,
  };

  return (
    <div className="h-[300px]">
      <Doughnut 
        options={chartOptions} 
        data={{ labels, datasets }} 
      />
    </div>
  );
}

export default CustomPieChart;
