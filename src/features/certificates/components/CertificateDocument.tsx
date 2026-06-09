import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'
import path from 'path'

Font.register({
  family: 'Cairo',
  src: path.join(process.cwd(), 'public', 'fonts', 'Cairo.ttf'),
})

export interface CertificateData {
  volunteerName: string
  opportunityTitle: string
  orgName: string
  hoursLogged: number
  issueDate: string
  verificationCode: string
  signatureBase64?: string
  qrCodeBase64: string
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    paddingTop: 44,
    fontFamily: 'Cairo',
  },
  accentBorderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3C3489',
  },
  accentBorderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#AFA9EC',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 36,
    height: 36,
    backgroundColor: '#3C3489',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Cairo',
  },
  platformName: {
    fontSize: 10,
    color: '#666666',
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E5E5E5',
    marginVertical: 14,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Cairo',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#787582',
    textAlign: 'center',
    fontFamily: 'Cairo',
  },
  body: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 14,
    gap: 10,
  },
  bodyRow: {
    alignItems: 'center',
  },
  bodyLabel: {
    fontSize: 9,
    color: '#787582',
    textAlign: 'center',
    fontFamily: 'Cairo',
    marginBottom: 2,
  },
  bodyValue: {
    fontSize: 13,
    fontFamily: 'Cairo',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  hoursBox: {
    backgroundColor: '#EEEDFE',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  hoursNumber: {
    fontSize: 26,
    fontFamily: 'Cairo',
    color: '#3C3489',
  },
  hoursLabel: {
    fontSize: 10,
    color: '#3C3489',
    fontFamily: 'Cairo',
    marginTop: 1,
  },
  footer: {
    marginTop: 'auto',
  },
  footerDivider: {
    height: 0.5,
    backgroundColor: '#E5E5E5',
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureArea: {
    alignItems: 'center',
  },
  signatureImage: {
    width: 90,
    height: 36,
    objectFit: 'contain',
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 12,
    fontFamily: 'Cairo',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  signatureLabel: {
    fontSize: 12,
    color: '#787582',
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  verificationArea: {
    alignItems: 'center',
  },
  verificationLabel: {
    fontSize: 12,
    color: '#787582',
    fontFamily: 'Cairo',
    marginBottom: 2,
    textAlign: 'center',
  },
  verificationCode: {
    fontSize: 7,
    color: '#3C3489',
    fontFamily: 'Cairo',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  verificationUrl: {
    fontSize: 7,
    color: '#787582',
    fontFamily: 'Cairo',
    textAlign: 'center',
  },
  qrCode: {
  width: 56,
  height: 56,
  },
  qrWrapper: {
    alignItems: 'center',
    gap: 3,
  },
})

export default function CertificateDocument({
  volunteerName,
  opportunityTitle,
  orgName,
  hoursLogged,
  issueDate,
  verificationCode,
  signatureBase64,
  qrCodeBase64,
}: CertificateData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const formattedDate = new Date(issueDate).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* Accent borders */}
        <View style={styles.accentBorderTop} />
        <View style={styles.accentBorderBottom} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>م</Text>
          </View>
          <Text style={styles.platformName}>موجود — منصة التطوع في غزة</Text>
        </View>

        <View style={styles.divider} />

        {/* Title */}
        <Text style={styles.title}>شهادة تطوع</Text>
        <Text style={styles.subtitle}>Certificate of Volunteering</Text>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.bodyRow}>
            <Text style={styles.bodyLabel}>يُشهد بأن</Text>
            <Text style={styles.bodyValue}>{volunteerName}</Text>
          </View>
          <View style={styles.bodyRow}>
            <Text style={styles.bodyLabel}>شارك في</Text>
            <Text style={styles.bodyValue}>{opportunityTitle}</Text>
          </View>
          <View style={styles.bodyRow}>
            <Text style={styles.bodyLabel}>بإشراف منظمة</Text>
            <Text style={styles.bodyValue}>{orgName}</Text>
          </View>
          <View style={styles.bodyRow}>
            <Text style={styles.bodyLabel}>بتاريخ</Text>
            <Text style={styles.bodyValue}>{formattedDate}</Text>
          </View>
        </View>

        {/* Hours */}
        <View style={styles.hoursBox}>
          <Text style={styles.hoursNumber}>{hoursLogged}</Text>
          <Text style={styles.hoursLabel}>ساعة تطوع</Text>
        </View>

{/* Footer */}
<View style={styles.footer}>
  <View style={styles.footerDivider} />
  <View style={styles.footerRow}>

    {/* يسار — QR + رمز التحقق */}
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
      <View style={styles.qrWrapper}>
        <Image src={qrCodeBase64} style={styles.qrCode} />
      </View>
      <View style={styles.verificationArea}>
        <Text style={styles.verificationLabel}>رمز التحقق</Text>
        <Text style={styles.verificationCode}>{verificationCode}</Text>
        <Text style={styles.verificationUrl}>
          {appUrl}/verify/{verificationCode}
        </Text>
      </View>
    </View>

    {/* يمين — التوقيع */}
    <View style={styles.signatureArea}>
      {signatureBase64 ? (
        <Image src={signatureBase64} style={styles.signatureImage} />
      ) : (
        <Text style={styles.signatureText}>{orgName}</Text>
      )}
      <Text style={styles.signatureLabel}>توقيع المنظمة</Text>
    </View>

  </View>
</View>

      </Page>
    </Document>
  )
}