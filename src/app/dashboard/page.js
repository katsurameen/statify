"use client";
import React, { Suspense } from "react";
import DashboardContent from "./dashboardContent";

export default function DashboardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
