export const saveTokenLogin = (accessToken, refreshToken, role) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("role", role);
};
export const saveToken = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};

export const convertToCambodiaTime = (utcTimestamp) => {
  // Create a Date object from the UTC timestamp
  const utcDate = new Date(utcTimestamp);

  // Convert to Cambodia time (UTC+7)
  const cambodiaTimeOffset = 7 * 60; // 7 hours in minutes
  const cambodiaDate = new Date(
    utcDate.getTime() + cambodiaTimeOffset * 60 * 1000,
  );

  // Format the date and time for output
  const day = String(cambodiaDate.getUTCDate()).padStart(2, "0");
  const month = String(cambodiaDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = cambodiaDate.getUTCFullYear();
  const hours = String(cambodiaDate.getUTCHours()).padStart(2, "0");
  const minutes = String(cambodiaDate.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}:${hours}:${minutes}`;
};
