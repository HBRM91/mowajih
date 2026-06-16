import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CONTACT_EMAIL = "Tawjih@jad2advisory.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-navy-800 mb-4 pb-2 border-b border-gold-100">{title}</h2>
      <div className="space-y-3 text-navy-600 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function PrivacyFR() {
  return (
    <>
      <Section title="1. Identité du responsable de traitement">
        <p>Le traitement de vos données est effectué par <strong>JAD 2 ADVISORY</strong> (Société à Responsabilité Limitée), immatriculée au Registre du Commerce de Casablanca sous le n° 699755, responsable de la plateforme JAD2 TAWJIH.</p>
        <p><strong>Contact officiel :</strong> <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:text-gold-700">{CONTACT_EMAIL}</a></p>
      </Section>

      <Section title="2. Données collectées et architecture technique">
        <p>JAD2 TAWJIH applique des règles strictes de minimisation des données et de transit volatile :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Données de simulation (strictement anonymisées) :</strong> filière Baccalauréat, notes par matière, mention calculée, tranche de revenu familial, ville et région. Ces données ne contiennent aucun identifiant nominatif dans nos bases de données applicatives.</li>
          <li><strong>Données de contact (transit éphémère — aucun stockage) :</strong> lorsque vous transmettez une demande via le formulaire de contact, vos données d'identification (nom, email, téléphone, message) <strong>ne sont jamais enregistrées ni stockées dans nos bases de données (Cloudflare KV/D1)</strong>. Elles sont immédiatement chiffrées et acheminées sous forme de flux volatile vers notre messagerie d'entreprise via un relais de transmission sécurisé.</li>
          <li><strong>Données non collectées :</strong> numéro de CIN, adresse postale, données de paiement, données biométriques.</li>
        </ul>
      </Section>

      <Section title="3. Finalités du traitement et cadre CNDP (Loi 09-08)">
        <ul className="list-disc pl-5 space-y-1">
          <li>Calcul algorithmique des correspondances école-profil et analyses statistiques de marché anonymes.</li>
          <li>Routage et livraison automatisés des demandes d'information commerciale initiées volontairement par l'internaute.</li>
        </ul>
        <p><strong>Base légale :</strong> consentement explicite recueilli à l'étape de validation du formulaire (art. 4 Loi 09-08).</p>
        <div className="mt-3 rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-3 text-xs text-navy-500 space-y-1">
          <p className="font-bold text-navy-600">Régime réglementaire déclaré</p>
          <p>• <strong>Traitement de la plateforme :</strong> ce traitement est en cours de notification auprès de la CNDP sous le régime de la Déclaration Simplifiée (Délibération n° 44-AU-2014).</p>
          <p>• <strong>Routage et hébergement technique :</strong> ce service s'appuie sur des infrastructures cloud externalisées (Cloudflare, Resend) impliquant un transit technique éphémère des flux hors du Maroc. Ce transfert fait l'objet d'une demande d'autorisation déposée auprès de la CNDP via le formulaire officiel F118.</p>
          <p className="italic text-navy-400 pt-1.5 mt-1.5 border-t border-navy-100/60">Dès obtention des récépissés officiels, les numéros d'autorisation seront affichés ici conformément à la Loi 09-08.</p>
        </div>
      </Section>

      <Section title="4. Durée de conservation">
        <p><strong>Données de simulation :</strong> les profils d'orientation strictement anonymisés sont conservés pour une durée maximale de 24 mois à des fins purement statistiques.</p>
        <p><strong>Données de contact :</strong> aucune durée de conservation sur le site web. Les données sont détruites instantanément des serveurs applicatifs dès le relais de l'e-mail. Les e-mails ainsi reçus sur notre messagerie d'entreprise sécurisée sont conservés pour une durée maximale de 12 mois à des fins de suivi de votre demande, avant d'être définitivement supprimés.</p>
      </Section>

      <Section title="5. Partage des données">
        <p><strong>Vos données nominatives ne sont jamais stockées, jamais vendues, et ne sont partagées avec aucun tiers.</strong> Aucun établissement d'enseignement supérieur ou partenaire commercial n'a accès à vos informations identifiables. Seules des données statistiques agrégées et totalement anonymes (ex. : « 35 % des bacheliers SM de Casablanca visent l'ingénierie ») peuvent être partagées à des fins d'analyse sectorielle du marché de l'éducation.</p>
      </Section>

      <Section title="6. Sécurité">
        <ul className="list-disc pl-5 space-y-1">
          <li>Intégration de protocoles de chiffrement stricts pour toutes les communications (HTTPS / TLS 1.3).</li>
          <li>Isolation complète de l'architecture : aucun lien logique ou nominal persistant entre l'outil de simulation et la boîte de réception des courriels.</li>
          <li>Protection périmétrique par pare-feu applicatif (WAF) Cloudflare contre les requêtes malveillantes.</li>
        </ul>
      </Section>

      <Section title="7. Vos droits (Loi 09-08)">
        <p>Conformément à la Loi 09-08, vous disposez des droits d'accès, de rectification et d'opposition pour des motifs légitimes. Du fait de notre architecture technique de transit éphémère, aucune donnée nominative n'est conservée à long terme sur notre plateforme.</p>
        <p>Pour toute demande d'information ou pour exercer ces droits, vous pouvez vous adresser à : <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:text-gold-700">{CONTACT_EMAIL}</a>. Une réponse vous sera apportée sous un délai maximum de 30 jours.</p>
        <p>En cas de litige, vous disposez du droit d'introduire une réclamation directement auprès de la <strong>CNDP</strong> : <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700">www.cndp.ma</a>.</p>
      </Section>

      <Section title="8. Cookies et stockage local (localStorage)">
        <p>JAD2 TAWJIH n'utilise <strong>aucun cookie publicitaire, aucun tracker commercial tiers, ni aucun pixel de ciblage</strong> (pas de Google Analytics).</p>
        <p>Nous exploitons uniquement le stockage local de votre propre navigateur (<code>localStorage</code>) via la clé technique <code>jad2-form</code>, dans l'unique but de mémoriser temporairement votre progression entre les différentes étapes du questionnaire d'orientation. Ces données restent locales sur votre appareil et ne sont jamais transmises à notre serveur avant votre validation finale.</p>
      </Section>

      <Section title="9. Conditions générales d'utilisation">
        <p>L'utilisation de JAD2 TAWJIH est <strong>gratuite et sans inscription</strong>. En utilisant le service, vous acceptez les présentes conditions.</p>
        <p><strong>Limitation de responsabilité :</strong> JAD2 TAWJIH fournit des recommandations à titre indicatif basées sur des données statistiques. JAD2 Advisory ne peut être tenu responsable des décisions d'admission prises par les établissements ni des conséquences de l'orientation choisie par l'utilisateur.</p>
        <p><strong>Propriété intellectuelle :</strong> le code, l'algorithme de recommandation, les contenus et la marque « JAD2 TAWJIH » sont la propriété exclusive de JAD2 Advisory. Toute reproduction commerciale sans autorisation est interdite.</p>
        <p><strong>Droit applicable :</strong> droit marocain. Tout litige sera soumis à la compétence exclusive des tribunaux de commerce de Casablanca.</p>
      </Section>
    </>
  );
}

function PrivacyAR() {
  return (
    <>
      <Section title="1. هوية المسؤول عن المعالجة">
        <p>تتم معالجة بياناتكم من قِبل شركة <strong>JAD 2 ADVISORY</strong> (شركة ذات مسؤولية محدودة)، المسجَّلة في السجل التجاري للدار البيضاء تحت رقم 699755، المسؤولة عن منصة JAD2 TAWJIH.</p>
        <p><strong>للتواصل الرسمي:</strong> <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:text-gold-700">{CONTACT_EMAIL}</a></p>
      </Section>

      <Section title="2. البيانات المُجمَّعة والبنية التقنية">
        <p>تطبّق JAD2 TAWJIH قواعد صارمة لتقليص البيانات وعبورها المؤقت:</p>
        <ul className="list-disc pr-5 space-y-1">
          <li><strong>بيانات المحاكاة (مجهولة الهوية تماماً):</strong> شعبة البكالوريا، النقاط حسب المادة، التقدير المحسوب، شريحة الدخل العائلي، المدينة والجهة. هذه البيانات لا تحتوي على أي معرّف اسمي في قواعد بياناتنا التطبيقية.</li>
          <li><strong>بيانات التواصل (عبور مؤقت — دون أي تخزين):</strong> عند إرسالكم طلباً عبر نموذج التواصل، فإن بيانات تعريفكم (الاسم، البريد الإلكتروني، الهاتف، الرسالة) <strong>لا تُسجَّل ولا تُخزَّن أبداً في قواعد بياناتنا (Cloudflare KV/D1)</strong>. بل تُشفَّر فوراً وتُحال في تدفق عابر إلى بريدنا المهني عبر وسيط نقل آمن.</li>
          <li><strong>بيانات غير مُجمَّعة إطلاقاً:</strong> رقم البطاقة الوطنية، العنوان البريدي، بيانات الدفع، البيانات البيومترية.</li>
        </ul>
      </Section>

      <Section title="3. أغراض المعالجة والإطار القانوني لـ CNDP (القانون 09-08)">
        <ul className="list-disc pr-5 space-y-1">
          <li>الحساب الخوارزمي لمدى التوافق بين الملف والمدارس، وإحصاءات السوق المجهولة الهوية.</li>
          <li>التوجيه والإحالة الآلية لطلبات المعلومات التجارية التي يبدؤها المستخدم طوعاً.</li>
        </ul>
        <p><strong>الأساس القانوني:</strong> موافقة صريحة تُجمع في خطوة التحقق من النموذج (المادة 4 من القانون 09-08).</p>
        <div className="mt-3 rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-3 text-xs text-navy-500 space-y-1">
          <p className="font-bold text-navy-600">النظام التنظيمي المُصرَّح به</p>
          <p>• <strong>معالجة المنصة:</strong> هذه المعالجة قيد التبليغ لدى CNDP في إطار نظام التصريح المبسَّط (المقرر رقم 44-AU-2014).</p>
          <p>• <strong>التوجيه والاستضافة التقنية:</strong> يعتمد هذا الخدمة على بنية حوسبة سحابية خارجية (Cloudflare، Resend) تترتب عليها عبور تقني مؤقت للتدفقات خارج المغرب. وهذا النقل موضوع طلب إذن مودَع لدى CNDP عبر الاستمارة الرسمية F118.</p>
          <p className="italic text-navy-400 pt-1.5 mt-1.5 border-t border-navy-100/60">بمجرد الحصول على الإيصالات الرسمية، سيتم نشر أرقام التراخيص هنا وفقاً للقانون 09-08.</p>
        </div>
      </Section>

      <Section title="4. مدة الاحتفاظ بالبيانات">
        <p><strong>بيانات المحاكاة:</strong> تُحفظ ملفات التوجيه المجهولة الهوية تماماً لمدة أقصاها 24 شهراً لأغراض إحصائية بحتة.</p>
        <p><strong>بيانات التواصل:</strong> لا توجد أي مدة احتفاظ على الموقع الإلكتروني. تُحذف البيانات فوراً من خوادمنا التطبيقية بمجرد إحالة البريد الإلكتروني. تُحفظ الرسائل المستلمة على بريدنا المهني الآمن لمدة أقصاها 12 شهراً لأغراض متابعة طلبكم، قبل حذفها نهائياً.</p>
      </Section>

      <Section title="5. مشاركة البيانات">
        <p><strong>لا تُخزَّن بياناتكم الاسمية أبداً، ولا تُباع أبداً، ولا تُشارَك مع أي طرف ثالث.</strong> لا يحق لأي مؤسسة للتعليم العالي أو شريك تجاري الوصول إلى معلوماتكم المعرِّفة. لا يمكن مشاركة إلا بيانات إحصائية مُجمَّعة ومجهولة الهوية تماماً لأغراض التحليل القطاعي لسوق التعليم.</p>
      </Section>

      <Section title="6. الأمان">
        <ul className="list-disc pr-5 space-y-1">
          <li>اعتماد بروتوكولات تشفير صارمة لجميع الاتصالات (HTTPS / TLS 1.3).</li>
          <li>عزل كامل للبنية: غياب تام لأي ربط منطقي أو اسمي دائم بين أداة المحاكاة وصندوق استقبال البريد الإلكتروني.</li>
          <li>حماية محيطية بجدار حماية تطبيقي (WAF) من Cloudflare ضد الطلبات الخبيثة.</li>
        </ul>
      </Section>

      <Section title="7. حقوقكم (القانون 09-08)">
        <p>وفقاً للقانون 09-08، تتوفرون على حقوق الوصول والتصحيح والاعتراض لأسباب مشروعة. وبسبب بنيتنا التقنية القائمة على العبور المؤقت، لا تُحفظ أي بيانات اسمية لفترة طويلة على منصتنا.</p>
        <p>لأي طلب معلومات أو لممارسة هذه الحقوق، يمكنكم التواصل على العنوان: <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:text-gold-700">{CONTACT_EMAIL}</a>. سنرد عليكم في غضون 30 يوماً كحد أقصى.</p>
        <p>في حالة وجود نزاع، يحق لكم تقديم شكاية مباشرة لدى <strong>CNDP</strong>: <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700">www.cndp.ma</a>.</p>
      </Section>

      <Section title="8. ملفات الارتباط والتخزين المحلي (localStorage)">
        <p>لا تستخدم JAD2 TAWJIH <strong>أي ملف ارتباط إعلاني، ولا أي متتبِّع تجاري خارجي، ولا أي بكسل تتبُّع</strong> (لا Google Analytics).</p>
        <p>نستخدم فقط التخزين المحلي لمتصفحكم الخاص (<code>localStorage</code>) عبر المفتاح التقني <code>jad2-form</code>، لغرض وحيد هو حفظ تقدمكم مؤقتاً بين مختلف خطوات استبيان التوجيه. تبقى هذه البيانات محلية على جهازكم ولا تُرسَل أبداً إلى خادمنا قبل تأكيدكم النهائي.</p>
      </Section>

      <Section title="9. شروط الاستخدام العامة">
        <p>استخدام JAD2 TAWJIH <strong>مجاني ودون تسجيل</strong>. باستخدامكم للخدمة، فإنكم توافقون على هذه الشروط.</p>
        <p><strong>حدود المسؤولية:</strong> توفر JAD2 TAWJIH توصيات استرشادية بناءً على بيانات إحصائية. لا يمكن مساءلة JAD2 Advisory عن قرارات القبول التي تتخذها المؤسسات أو عواقب التوجه الذي يختاره المستخدم.</p>
        <p><strong>الملكية الفكرية:</strong> الكود والخوارزمية والمحتوى والعلامة التجارية "JAD2 TAWJIH" ملك حصري لـ JAD2 Advisory. يُحظر أي استخدام تجاري دون إذن مسبق.</p>
        <p><strong>القانون المطبق:</strong> القانون المغربي. يُحال أي نزاع إلى الاختصاص الحصري للمحاكم التجارية بالدار البيضاء.</p>
      </Section>
    </>
  );
}

function PrivacyEN() {
  return (
    <>
      <Section title="1. Data controller identity">
        <p>Your data is processed by <strong>JAD 2 ADVISORY</strong> (a Moroccan limited liability company), registered with the Casablanca Trade Register under no. 699755, responsible for the JAD2 TAWJIH platform.</p>
        <p><strong>Official contact:</strong> <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:text-gold-700">{CONTACT_EMAIL}</a></p>
      </Section>

      <Section title="2. Data collected and technical architecture">
        <p>JAD2 TAWJIH applies strict data-minimisation rules and volatile transit:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Simulation data (strictly anonymised):</strong> Baccalaureate track, grades by subject, calculated distinction, household income bracket, city and region. This data contains no nominal identifier in our application databases.</li>
          <li><strong>Contact data (ephemeral transit — no storage):</strong> when you submit a request via our contact form, your identification data (name, email, phone, message) is <strong>never recorded or stored in our databases (Cloudflare KV/D1)</strong>. It is immediately encrypted and routed as a volatile stream to our corporate mailbox via a secure transmission relay.</li>
          <li><strong>Data we never collect:</strong> national ID number, postal address, payment data, biometric data.</li>
        </ul>
      </Section>

      <Section title="3. Purposes of processing and CNDP framework (Law 09-08)">
        <ul className="list-disc pl-5 space-y-1">
          <li>Algorithmic matching of student profiles with schools and anonymous market statistics.</li>
          <li>Automated routing and delivery of commercial information requests voluntarily initiated by the user.</li>
        </ul>
        <p><strong>Legal basis:</strong> explicit consent collected at the form validation step (Art. 4, Law 09-08).</p>
        <div className="mt-3 rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-3 text-xs text-navy-500 space-y-1">
          <p className="font-bold text-navy-600">Declared regulatory regime</p>
          <p>• <strong>Platform processing:</strong> this processing is currently being notified to the CNDP under the Simplified Declaration regime (Deliberation No. 44-AU-2014).</p>
          <p>• <strong>Routing and technical hosting:</strong> this service relies on outsourced cloud infrastructure (Cloudflare, Resend) involving ephemeral technical transit of data flows outside Morocco. This transfer is the subject of an authorisation request filed with the CNDP via the official Form F118.</p>
          <p className="italic text-navy-400 pt-1.5 mt-1.5 border-t border-navy-100/60">Once the official receipts are obtained, the authorisation numbers will be displayed here in accordance with Law 09-08.</p>
        </div>
      </Section>

      <Section title="4. Retention period">
        <p><strong>Simulation data:</strong> strictly anonymised orientation profiles are retained for a maximum of 24 months for purely statistical purposes.</p>
        <p><strong>Contact data:</strong> no retention period on the website whatsoever. Data is instantly destroyed from our application servers as soon as the email is relayed. Emails received in our secure corporate mailbox are retained for a maximum of 12 months for the purpose of following up on your request, after which they are permanently deleted.</p>
      </Section>

      <Section title="5. Data sharing">
        <p><strong>Your nominal data is never stored, never sold, and never shared with any third party.</strong> No higher-education institution or commercial partner has access to your identifiable information. Only aggregated, fully anonymous statistical data may be shared for educational market sector analysis purposes.</p>
      </Section>

      <Section title="6. Security">
        <ul className="list-disc pl-5 space-y-1">
          <li>Strict encryption protocols applied to all communications (HTTPS / TLS 1.3).</li>
          <li>Complete architectural isolation: no persistent logical or nominal link between the simulation tool and the email inbox.</li>
          <li>Perimeter protection via Cloudflare Web Application Firewall (WAF) against malicious requests.</li>
        </ul>
      </Section>

      <Section title="7. Your rights (Law 09-08)">
        <p>In accordance with Law 09-08, you have the rights of access, rectification and objection for legitimate reasons. Because of our ephemeral-transit technical architecture, no nominal data is retained long-term on our platform.</p>
        <p>For any information request or to exercise these rights, you may contact us at: <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:text-gold-700">{CONTACT_EMAIL}</a>. You will receive a response within a maximum of 30 days.</p>
        <p>In the event of a dispute, you have the right to file a complaint directly with the <strong>CNDP</strong>: <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700">www.cndp.ma</a>.</p>
      </Section>

      <Section title="8. Cookies and local storage (localStorage)">
        <p>JAD2 TAWJIH uses <strong>no advertising cookies, no third-party commercial trackers, and no targeting pixels</strong> (no Google Analytics).</p>
        <p>We exclusively use your own browser's local storage (<code>localStorage</code>) via the technical key <code>jad2-form</code>, for the sole purpose of temporarily memorising your progress between the different steps of the orientation questionnaire. This data remains local to your device and is never transmitted to our server before your final validation.</p>
      </Section>

      <Section title="9. Terms of use">
        <p>JAD2 TAWJIH is <strong>free to use and requires no account</strong>. By using the service, you agree to these terms.</p>
        <p><strong>Limitation of liability:</strong> JAD2 TAWJIH provides indicative recommendations based on statistical data. JAD2 Advisory is not liable for admission decisions made by institutions nor for the consequences of the orientation chosen by the user.</p>
        <p><strong>Intellectual property:</strong> the code, recommendation algorithm, content, and "JAD2 TAWJIH" brand are the exclusive property of JAD2 Advisory. Commercial reproduction without authorisation is prohibited.</p>
        <p><strong>Governing law:</strong> Moroccan law. Disputes shall be submitted to the exclusive jurisdiction of the Casablanca Commercial Courts.</p>
      </Section>
    </>
  );
}

const HEADERS = {
  fr: {
    badge: "Documents légaux",
    title: "Politique de Confidentialité",
    subtitle: "Dernière mise à jour : Juin 2026 · JAD2 TAWJIH — Division Éducation de JAD2 Advisory",
    disclaimer: "Outil d'orientation indépendant. JAD2 TAWJIH n'est partenaire d'aucun établissement présenté. Les résultats sont indicatifs et non contractuels. Vérifiez toujours les conditions d'admission officielles sur le site de l'établissement ou sur cursussup.gov.ma.",
    footer1: `© 2026 JAD2 Advisory · Division Éducation · ${CONTACT_EMAIL}`,
    footer2: "Conforme Loi 09-08 (CNDP Maroc) · Outil d'orientation indépendant — Non affilié aux établissements présentés",
  },
  ar: {
    badge: "وثائق قانونية",
    title: "سياسة الخصوصية",
    subtitle: "آخر تحديث: يونيو 2026 · JAD2 TAWJIH — قسم التعليم بـ JAD2 Advisory",
    disclaimer: "أداة توجيه مستقلة. JAD2 TAWJIH ليست شريكة لأي مؤسسة معروضة. النتائج استرشادية وغير مُلزِمة. تحقق دائماً من شروط القبول الرسمية على الموقع الرسمي للمؤسسة أو cursussup.gov.ma.",
    footer1: `© 2026 JAD2 Advisory · قسم التعليم · ${CONTACT_EMAIL}`,
    footer2: "متوافق مع القانون 09-08 (CNDP المغرب) · أداة توجيه مستقلة — غير مرتبطة بالمؤسسات المعروضة",
  },
  en: {
    badge: "Legal documents",
    title: "Privacy Policy",
    subtitle: "Last updated: June 2026 · JAD2 TAWJIH — Education Division of JAD2 Advisory",
    disclaimer: "Independent orientation tool. JAD2 TAWJIH is not affiliated with any institution listed. Results are indicative and non-binding. Always verify official admission requirements at the institution's website or cursussup.gov.ma.",
    footer1: `© 2026 JAD2 Advisory · Education Division · ${CONTACT_EMAIL}`,
    footer2: "Compliant with Law 09-08 (CNDP Morocco) · Independent orientation tool — not affiliated with listed institutions",
  },
} as const;

type Lang = keyof typeof HEADERS;

export default function Privacy() {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language.startsWith("ar") ? "ar" : i18n.language.startsWith("en") ? "en" : "fr";
  const h = HEADERS[lang];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-12"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-wider mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {h.badge}
        </div>
        <h1 className="font-heading text-4xl font-bold text-navy-900">{h.title}</h1>
        <p className="text-navy-400 text-sm mt-2">{h.subtitle}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 flex items-start gap-3">
        <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
        <p className="text-sm text-amber-800 leading-relaxed">{h.disclaimer}</p>
      </div>

      {lang === "ar" ? <PrivacyAR /> : lang === "en" ? <PrivacyEN /> : <PrivacyFR />}

      <div className="mt-12 p-5 bg-navy-50 rounded-2xl border border-navy-100 text-center">
        <p className="text-xs text-navy-400">{h.footer1}</p>
        <p className="text-xs text-navy-300 mt-1">{h.footer2}</p>
      </div>
    </motion.div>
  );
}
