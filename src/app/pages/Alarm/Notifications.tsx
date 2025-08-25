import React, { useEffect } from "react";
import { Breadcrumb } from "antd";
import AlarmNotificationsTable from "./components/AlarmNotificationsTable";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectAlarmNotificationsLoading,
  selectAlarmNotificationsData,
  actionGetNotificationsList,
} from "@/store/alarmNotificationsSlice";

const AlarmNotifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAlarmNotificationsLoading);
  const data = useAppSelector(selectAlarmNotificationsData);

  useEffect(() => {
    dispatch(actionGetNotificationsList());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 pb-4">
        <Breadcrumb className="text-sm">
          <Breadcrumb.Item>Alarm</Breadcrumb.Item>
          <Breadcrumb.Item className="font-medium">
            Notifications
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Alarm Notifications
        </h1>
      </div>

      <div className="flex-1 py-4">
        <AlarmNotificationsTable loading={loading} dataSource={data} />
      </div>
    </div>
  );
};

export default AlarmNotifications;
