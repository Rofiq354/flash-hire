import {
  Html, Body, Head, Container, Preview, Section, 
  Heading, Text, Button, Hr, Link
} from "@react-email/components";
import * as React from "react";

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  salary?: string;
}

export const JobAlertEmail = ({ jobs, jobTitle }: { jobs: Job[], jobTitle: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Kami menemukan {jobs.length} lowongan baru untuk {jobTitle}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Job Alert: {jobTitle}</Heading>
          <Text style={text}>
            Halo! Kami menemukan beberapa posisi yang sangat cocok dengan kriteria yang kamu cari di Adzuna.
          </Text>

          {jobs.map((job, index) => (
            <Section key={index} style={jobCard}>
              <Text style={jobTitleStyle}>{job.title}</Text>
              <Text style={jobInfo}>{job.company} • {job.location}</Text>
              {job.salary && <Text style={salaryBadge}>{job.salary}</Text>}
              <Button style={button} href={job.url}>
                Lamar Sekarang
              </Button>
            </Section>
          ))}

          <Hr style={hr} />
          <Text style={footer}>
            Kamu menerima email ini karena kamu mengatur Job Alert untuk "{jobTitle}".
            <br />
            <Link href="#" style={anchor}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// --- Styling ---
const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "20px 0 48px", width: "580px" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", textAlign: "center" as const };
const text = { color: "#555", fontSize: "16px", lineHeight: "26px", textAlign: "center" as const };
const jobCard = { backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e1e4e8", marginBottom: "15px" };
const jobTitleStyle = { fontSize: "18px", fontWeight: "bold", color: "#1a1a1a", margin: "0" };
const jobInfo = { fontSize: "14px", color: "#666", margin: "4px 0" };
const salaryBadge = { display: "inline-block", padding: "4px 8px", backgroundColor: "#e7f3ff", color: "#007bff", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" };
const button = { backgroundColor: "#007bff", color: "#fff", padding: "12px 20px", borderRadius: "6px", fontWeight: "bold", textDecoration: "none", textAlign: "center" as const, display: "block", marginTop: "10px" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
const anchor = { color: "#556cd6" };