import React, { useState } from "react";
import { Header } from "./creator/Header";
import { JobForm } from "./creator/JobForm";
import { JobList } from "./creator/JobList";
import { SubmitDialog } from "./creator/SubmitDialog";
import { useToast } from "@/components/ui/use-toast";

export function Creator() {
  const [activePage, setActivePage] = useState("addJobs");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    task: "",
    ustarPoints: "",
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const handleSave = () => {
    if (validateForm()) {
      const newJob = {
        ...formData,
        id: Date.now(),
        status: "draft",
        createdAt: new Date().toISOString(),
      };
      setJobs((prev) => [...prev, newJob]);
      resetForm();
      toast({
        title: "Job Saved",
        description: "Your job has been saved as a draft.",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSubmitDialog(true);
    }
  };

  const confirmSubmit = () => {
    const newJob = {
      ...formData,
      id: Date.now(),
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [...prev, newJob]);
    resetForm();
    setShowSubmitDialog(false);
    setActivePage("postedJobs");
    toast({
      title: "Job Submitted",
      description: "Your job has been submitted successfully.",
    });
  };

  const resetForm = () => {
    setFormData({ heading: "", description: "", task: "", ustarPoints: "" });
    setErrors({});
  };

  const validateForm = () => {
    const requiredFields = ["heading", "description", "task", "ustarPoints"];
    const newErrors = requiredFields.reduce((acc, field) => {
      if (field === "ustarPoints") {
        acc[field] =
          !formData[field].trim() ||
          !/^[0-9]+$/.test(formData[field]) ||
          parseInt(formData[field], 10) < 0;
      } else {
        acc[field] = !formData[field].trim();
      }
      return acc;
    }, {});
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in all required fields with valid values. USTAR Points must be a non-negative integer.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    toast({
      title: "Job Updated",
      description: "Your job has been updated successfully.",
    });
  };

  const handleSubmitJob = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    toast({
      title: "Job Submitted",
      description: "Your job has been submitted successfully.",
    });
    setActivePage("postedJobs");
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="container mx-auto px-4 py-8">
        {activePage === "addJobs" ? (
          <JobForm
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            handleSubmit={handleSubmit}
            errors={errors}
            setErrors={setErrors}
          />
        ) : (
          <JobList
            jobs={jobs}
            onUpdateJob={handleUpdateJob}
            onSubmitJob={handleSubmitJob}
          />
        )}
      </main>

      <SubmitDialog
        show={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={confirmSubmit}
      />
    </div>
  );
}
