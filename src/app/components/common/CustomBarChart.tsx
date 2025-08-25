import { DynamicKeyObject } from "@/interfaces/app";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataset,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ICustomBarChartProps {
  labels: string[];
  datasets: ChartDataset<"bar", (number | [number, number] | null)[]>[];
  options?: DynamicKeyObject;
}

const INITITAL_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

function CustomBarChart(props: ICustomBarChartProps) {
  const { labels, datasets, options = INITITAL_OPTIONS } = props;
  return <Bar options={options} data={{ labels, datasets }} />;
}

export default CustomBarChart;
