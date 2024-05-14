import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import React, { useState, useEffect } from "react";
import axios from "axios";
const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from both Commande and Product models
        const [commandeResponse, productResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/commande"),
          axios.get("http://localhost:5000/api/products"),
        ]);

        // Process data to calculate revenue for each category
        const commandeData = commandeResponse.data;
        const productData = productResponse.data;

        const revenueByCategory = {};

        // Calculate revenue for each category based on Commande data
        commandeData.forEach((commande) => {
          if (!revenueByCategory[commande.category]) {
            revenueByCategory[commande.category] = 0;
          }
          revenueByCategory[commande.category] += commande.price * commande.quantity;
        });

        // Calculate revenue for each category based on Product data
        productData.forEach((product) => {
          if (!revenueByCategory[product.category]) {
            revenueByCategory[product.category] = 0;
          }
          // Assuming quantity sold is the total quantity
          revenueByCategory[product.category] += product.price * product.quantity;
        });

        // Convert revenue data to match the LineChart data format
        const lineChartData = Object.keys(revenueByCategory).map((category) => ({
          id: category,
          color: getCategoryColor(category), // Define a function to get color based on category
          data: [
            { x: "Week 1", y: revenueByCategory[category] },
            { x: "Week 2", y: revenueByCategory[category] }, // Add more data points as needed
          ],
        }));

        setLineData(lineChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getCategoryColor = (category) => {
   
    const categoryColors = {
        "Women": "#2196F3",
        "Man": "#4CAF50",
        
    };

    
    return categoryColors[category] || "#607D8B"; // Default color: Grey
};


  return (
    <ResponsiveLine
      data={lineData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
