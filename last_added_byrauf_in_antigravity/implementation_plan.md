# TalkBack (Ekran Oxuyucu) İnteqrasiya Planı

Bu sənəd layihəyə xüsusi bir "TalkBack / Screen Reader" (ekran oxuyucu) əlçatanlıq funksiyasının necə əlavə olunacağını detallı şəkildə izah edir. Bu xüsusiyyət görmə məhdudiyyətli və ya oxumaqda çətinlik çəkən istifadəçilər üçün nəzərdə tutulub.

## ⚠️ User Review Required

> [!IMPORTANT]  
> **Səs Dili Baza Dəstəyi (Voice Language Support)**
> Veb-brauzerlərin (Chrome, Safari, Firefox) və Əməliyyat Sistemlərinin (Windows, macOS) böyük əksəriyyətində standart olaraq **Azərbaycan dili (az-AZ)** üçün səs (Text-to-Speech) paketi mövcud deyil. 
> Bu halda səs mexanizmi yazını standart İngilis və ya Türk dili (tr-TR) ləhcəsi ilə (robotik formada) oxuyacaq. Tam təbii Azərbaycan dili üçün xüsusi ödənişli bulud API-lərinə (məsələn, Google Cloud TTS) ehtiyac var. Hazırkı plan **pulsuz Web Speech API** (brauzer daxili) üzərindən qurulub. Təsdiqləyirsiniz?

## Open Questions

1. **Oxuma Mexanizmi**: Yazının oxunması siçanı həmin yazının **üzərinə gətirəndə** (hover) baş versin, yoxsa yazının üstünə **kliklədikdə**? (Qeyd: Ən uyğun UX siçanı üzərinə gətirəndə oxunmasıdır).
2. **Vurğulama**: Mətn oxunarkən ekranda həmin hissənin ətrafında sarı/mavi xətt ilə vurğulanmasını (outline) istəyirsinizmi?

## Proposed Changes

Aşağıdakı fayllarda dəyişikliklər olunacaq:

---

### Məntiq və Məlumat Modeli (State & Logic)

#### [MODIFY] [AccessibilityPanel.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/AccessibilityPanel.tsx)
- `A11ySettings` interfeysinə `talkBack: boolean` parametri əlavə ediləcək.
- Əlçatanlıq panelinə yeni "Səsli oxuma (TalkBack)" düyməsi və `Volume2` (və ya `Speech`) ikonu əlavə olunacaq.
- Tətbiq olunan (Global) `useEffect` daxilində `talkBack` aktiv olduqda `mouseover` (üzərinə gəlmək) və `mouseout` (tərk etmək) event-ləri bədənə (body) quraşdırılacaq.
- Elementlərin içərisindəki mətni çıxarıb Web Speech API (`window.speechSynthesis.speak()`) vasitəsilə oxuyan köməkçi funksiya yazılacaq.
- Oxunacaq elementi vizual olaraq vurğulamaq üçün qlobal CSS sinfi (`.a11y-talkback-highlight`) tətbiq ediləcək.

### Stilizasiya (CSS)

#### [MODIFY] [index.css](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/index.css)
- `.a11y-talkback-highlight` adlı yeni CSS obyekti yaradılacaq. Bu sinif mətn oxunduğu zaman həmin elementin ətrafına nəzərəçarpan vizual (outline) çərçivə verəcək ki, istifadəçi hazırda haranın oxunduğunu asanlıqla bilsin.

## Verification Plan

### Automated Tests
- TypeScript kompilasiyası (npx tsc --noEmit) tam xətasız olmalıdır.

### Manual Verification
1. Əlçatanlıq (Accessibility) menyusu açılmalı və yeni "Səsli oxuma" düyməsi aktiv edilməlidir.
2. Siçan istənilən mətn, düymə və ya başlığın üzərinə gətirildikdə:
   - Brauzer həmin mətni səsli oxumalıdır.
   - Həmin mətn vizual olaraq qutuya alınmalıdır (outline).
   - Yeni mətnin üzərinə keçdikdə əvvəlki oxuma dayandırılıb dərhal yeni mətn oxunmağa başlanmalıdır.
3. Düyməni bağladıqda səs dərhal kəsilməli və oxuma deaktiv olmalıdır.
