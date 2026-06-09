const blockedEmailDomains = [
  "yopmail.com",
  "yopmail.fr",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "trashmail.com",
];

export function getEmailDomain(email: string) {
  return email.split("@")[1]?.trim().toLowerCase();
}

export function isBlockedEmailDomain(email: string) {
  const domain = getEmailDomain(email);

  if (!domain) {
    return true;
  }

  return blockedEmailDomains.includes(domain);
}
