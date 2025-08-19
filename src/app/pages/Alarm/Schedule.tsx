import React, { useEffect } from "react";
import { Breadcrumb, Card } from "antd";
import AlarmScheduleFilterBar from "./components/AlarmScheduleFilterBar";
import AlarmScheduleTable from "./components/AlarmScheduleTable";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectAlarmScheduleLoading,
  actionGetAlarmScheduleList,
} from "@/store/alarmScheduleSlice";

const AlarmSchedule: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAlarmScheduleLoading);

  useEffect(() => {
    dispatch(actionGetAlarmScheduleList({}));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Alarm</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">Schedule</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Alarm Schedule Management
        </h1>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-4">
        <Card
          size="small"
          className="alarm-schedule-filter-bar"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-100)",
            borderRadius: "8px",
          }}
        >
          <AlarmScheduleFilterBar loading={loading} />
        </Card>

        <AlarmScheduleTable loading={loading} />
      </div>
    </div>
  );
};

export default AlarmSchedule;
