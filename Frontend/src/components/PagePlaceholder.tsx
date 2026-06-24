import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Section } from "./Section";

export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Section
      eyebrow="Coming soon"
      title={title}
      description={
        description ??
        "This page is scaffolded with the global theme. Drop in your content and ship."
      }
      actions={
        <>
          <Button variant="hero" size="large">
            Get started
          </Button>
          <Button variant="subtle" size="large">
            Learn more
          </Button>
        </>
      }
      spacing="md"
    >
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {[
          { label: "Fast", body: "Optimized layout primitives and tokens." },
          { label: "Consistent", body: "Reusable Card, Button and Section styles." },
          { label: "Responsive", body: "Containers adapt across every breakpoint." },
        ].map((f) => (
          <Card key={f.label} variant="interactive">
            <CardContent>
              <Stack spacing={1.5}>
                <Chip label={f.label} size="small" />
                <Typography variant="h5">{f.label} by default</Typography>
                <Typography variant="body2">{f.body}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Section>
  );
}
