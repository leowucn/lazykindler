#! /usr/bin/python3
# -*- coding: utf-8 -*-

########################################################################
#   Copyright (C) 2021  alexpdev
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Lesser General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Lesser General Public License for more details.
#
#  You should have received a copy of the GNU Lesser General Public License
#  along with this program.  If not, see <https://www.gnu.org/licenses/>.
##############################################################################
"""Standards, encodings and mappings used for metadata translating."""

palmdoc_header = {
    "compression_type": (0x00, b">H", 2),
    "fill0": (0x02, b">H", 2),
    "text_length": (0x04, b">L", 4),
    "text_records": (0x08, b">H", 2),
    "max_section_size": (0x0A, b">H", 2),
    "read_pos   ": (0x0C, b">L", 4),
}

mobi6_header = {
    "compression_type": (0x00, b">H", 2),
    "fill0": (0x02, b">H", 2),
    "text_length": (0x04, b">L", 4),
    "text_records": (0x08, b">H", 2),
    "max_section_size": (0x0A, b">H", 2),
    "crypto_type": (0x0C, b">H", 2),
    "fill1": (0x0E, b">H", 2),
    "magic": (0x10, b"4s", 4),
    "header_length (from MOBI)": (0x14, b">L", 4),
    "type": (0x18, b">L", 4),
    "codepage": (0x1C, b">L", 4),
    "unique_id": (0x20, b">L", 4),
    "version": (0x24, b">L", 4),
    "metaorthindex": (0x28, b">L", 4),
    "metainflindex": (0x2C, b">L", 4),
    "index_names": (0x30, b">L", 4),
    "index_keys": (0x34, b">L", 4),
    "extra_index0": (0x38, b">L", 4),
    "extra_index1": (0x3C, b">L", 4),
    "extra_index2": (0x40, b">L", 4),
    "extra_index3": (0x44, b">L", 4),
    "extra_index4": (0x48, b">L", 4),
    "extra_index5": (0x4C, b">L", 4),
    "first_nontext": (0x50, b">L", 4),
    "title_offset": (0x54, b">L", 4),
    "title_length": (0x58, b">L", 4),
    "language_code": (0x5C, b">L", 4),
    "dict_in_lang": (0x60, b">L", 4),
    "dict_out_lang": (0x64, b">L", 4),
    "min_version": (0x68, b">L", 4),
    "first_resc_offset": (0x6C, b">L", 4),
    "huff_offset": (0x70, b">L", 4),
    "huff_num": (0x74, b">L", 4),
    "huff_tbl_offset": (0x78, b">L", 4),
    "huff_tbl_len": (0x7C, b">L", 4),
    "exth_flags": (0x80, b">L", 4),
    "fill3_a": (0x84, b">L", 4),
    "fill3_b": (0x88, b">L", 4),
    "fill3_c": (0x8C, b">L", 4),
    "fill3_d": (0x90, b">L", 4),
    "fill3_e": (0x94, b">L", 4),
    "fill3_f": (0x98, b">L", 4),
    "fill3_g": (0x9C, b">L", 4),
    "fill3_h": (0xA0, b">L", 4),
    "unknown0": (0xA4, b">L", 4),
    "drm_offset": (0xA8, b">L", 4),
    "drm_count": (0xAC, b">L", 4),
    "drm_size": (0xB0, b">L", 4),
    "drm_flags": (0xB4, b">L", 4),
    "fill4_a": (0xB8, b">L", 4),
    "fill4_b": (0xBC, b">L", 4),
    "first_content": (0xC0, b">H", 2),
    "last_content": (0xC2, b">H", 2),
    "unknown0": (0xC4, b">L", 4),
    "fcis_offset": (0xC8, b">L", 4),
    "fcis_count": (0xCC, b">L", 4),
    "flis_offset": (0xD0, b">L", 4),
    "flis_count": (0xD4, b">L", 4),
    "unknown1": (0xD8, b">L", 4),
    "unknown2": (0xDC, b">L", 4),
    "srcs_offset": (0xE0, b">L", 4),
    "srcs_count": (0xE4, b">L", 4),
    "unknown3": (0xE8, b">L", 4),
    "unknown4": (0xEC, b">L", 4),
    "fill5": (0xF0, b">H", 2),
    "traildata_flags": (0xF2, b">H", 2),
    "ncx_index": (0xF4, b">L", 4),
    "unknown5": (0xF8, b">L", 4),
    "unknown6": (0xFC, b">L", 4),
    "datp_offset": (0x100, b">L", 4),
    "unknown7": (0x104, b">L", 4),
    "Unknown    ": (0x108, b">L", 4),
    "Unknown    ": (0x10C, b">L", 4),
    "Unknown    ": (0x110, b">L", 4),
    "Unknown    ": (0x114, b">L", 4),
    "Unknown    ": (0x118, b">L", 4),
    "Unknown    ": (0x11C, b">L", 4),
    "Unknown    ": (0x120, b">L", 4),
    "Unknown    ": (0x124, b">L", 4),
    "Unknown    ": (0x128, b">L", 4),
    "Unknown    ": (0x12C, b">L", 4),
    "Unknown    ": (0x130, b">L", 4),
    "Unknown    ": (0x134, b">L", 4),
    "Unknown    ": (0x138, b">L", 4),
    "Unknown    ": (0x11C, b">L", 4),
}

mobi8_header = {
    "compression_type": (0x00, b">H", 2),
    "fill0": (0x02, b">H", 2),
    "text_length": (0x04, b">L", 4),
    "text_records": (0x08, b">H", 2),
    "max_section_size": (0x0A, b">H", 2),
    "crypto_type": (0x0C, b">H", 2),
    "fill1": (0x0E, b">H", 2),
    "magic": (0x10, b"4s", 4),
    "header_length (from MOBI)": (0x14, b">L", 4),
    "type": (0x18, b">L", 4),
    "codepage": (0x1C, b">L", 4),
    "unique_id": (0x20, b">L", 4),
    "version": (0x24, b">L", 4),
    "metaorthindex": (0x28, b">L", 4),
    "metainflindex": (0x2C, b">L", 4),
    "index_names": (0x30, b">L", 4),
    "index_keys": (0x34, b">L", 4),
    "extra_index0": (0x38, b">L", 4),
    "extra_index1": (0x3C, b">L", 4),
    "extra_index2": (0x40, b">L", 4),
    "extra_index3": (0x44, b">L", 4),
    "extra_index4": (0x48, b">L", 4),
    "extra_index5": (0x4C, b">L", 4),
    "first_nontext": (0x50, b">L", 4),
    "title_offset": (0x54, b">L", 4),
    "title_length": (0x58, b">L", 4),
    "language_code": (0x5C, b">L", 4),
    "dict_in_lang": (0x60, b">L", 4),
    "dict_out_lang": (0x64, b">L", 4),
    "min_version": (0x68, b">L", 4),
    "first_resc_offset": (0x6C, b">L", 4),
    "huff_offset": (0x70, b">L", 4),
    "huff_num": (0x74, b">L", 4),
    "huff_tbl_offset": (0x78, b">L", 4),
    "huff_tbl_len": (0x7C, b">L", 4),
    "exth_flags": (0x80, b">L", 4),
    "fill3_a": (0x84, b">L", 4),
    "fill3_b": (0x88, b">L", 4),
    "fill3_c": (0x8C, b">L", 4),
    "fill3_d": (0x90, b">L", 4),
    "fill3_e": (0x94, b">L", 4),
    "fill3_f": (0x98, b">L", 4),
    "fill3_g": (0x9C, b">L", 4),
    "fill3_h": (0xA0, b">L", 4),
    "unknown0": (0xA4, b">L", 4),
    "drm_offset": (0xA8, b">L", 4),
    "drm_count": (0xAC, b">L", 4),
    "drm_size": (0xB0, b">L", 4),
    "drm_flags": (0xB4, b">L", 4),
    "fill4_a": (0xB8, b">L", 4),
    "fill4_b": (0xBC, b">L", 4),
    "fdst_offset": (0xC0, b">L", 4),
    "fdst_flow_count": (0xC4, b">L", 4),
    "fcis_offset": (0xC8, b">L", 4),
    "fcis_count": (0xCC, b">L", 4),
    "flis_offset": (0xD0, b">L", 4),
    "flis_count": (0xD4, b">L", 4),
    "unknown1": (0xD8, b">L", 4),
    "unknown2": (0xDC, b">L", 4),
    "srcs_offset": (0xE0, b">L", 4),
    "srcs_count": (0xE4, b">L", 4),
    "unknown3": (0xE8, b">L", 4),
    "unknown4": (0xEC, b">L", 4),
    "fill5": (0xF0, b">H", 2),
    "traildata_flags": (0xF2, b">H", 2),
    "ncx_index": (0xF4, b">L", 4),
    "fragment_index": (0xF8, b">L", 4),
    "skeleton_index": (0xFC, b">L", 4),
    "datp_offset": (0x100, b">L", 4),
    "guide_index": (0x104, b">L", 4),
    "Unknown    ": (0x108, b">L", 4),
    "Unknown    ": (0x10C, b">L", 4),
    "Unknown    ": (0x110, b">L", 4),
    "Unknown    ": (0x114, b">L", 4),
    "Unknown    ": (0x118, b">L", 4),
    "Unknown    ": (0x11C, b">L", 4),
    "Unknown    ": (0x120, b">L", 4),
    "Unknown    ": (0x124, b">L", 4),
    "Unknown    ": (0x128, b">L", 4),
    "Unknown    ": (0x12C, b">L", 4),
    "Unknown    ": (0x130, b">L", 4),
    "Unknown    ": (0x134, b">L", 4),
    "Unknown    ": (0x138, b">L", 4),
    "Unknown    ": (0x11C, b">L", 4),
}

id_map_strings = {
    1: "Drm Server Id",
    2: "Drm Commerce Id",
    3: "Drm Ebookbase Book Id",
    4: "Drm Ebookbase Dep Id",
    100: "Creator",
    101: "Publisher",
    102: "Imprint",
    103: "Description",
    104: "ISBN",
    105: "Subject",
    106: "Published",
    107: "Review",
    108: "Contributor",
    109: "Rights",
    110: "SubjectCode",
    111: "Type",
    112: "Source",
    113: "ASIN",
    114: "versionNumber",
    117: "Adult",
    118: "Retail-Price",
    119: "Retail-Currency",
    120: "TSC",
    122: "fixed-layout",
    123: "book-type",
    124: "orientation-lock",
    126: "original-resolution",
    127: "zero-gutter",
    128: "zero-margin",
    129: "MetadataResourceURI",
    132: "RegionMagnification",
    150: "LendingEnabled",
    200: "DictShortName",
    501: "cdeType",
    502: "last_update_time",
    503: "Updated_Title",
    504: "CDEContentKey",
    505: "AmazonContentReference",
    506: "Title-Language",
    507: "Title-Display-Direction",
    508: "Title-Pronunciation",
    509: "Title-Collation",
    510: "Secondary-Title",
    511: "Secondary-Title-Language",
    512: "Secondary-Title-Direction",
    513: "Secondary-Title-Pronunciation",
    514: "Secondary-Title-Collation",
    515: "Author-Language",
    516: "Author-Display-Direction",
    517: "Author-Pronunciation",
    518: "Author-Collation",
    519: "Author-Type",
    520: "Publisher-Language",
    521: "Publisher-Display-Direction",
    522: "Publisher-Pronunciation",
    523: "Publisher-Collation",
    524: "Content-Language-Tag",
    525: "primary-writing-mode",
    526: "NCX-Ingested-By-Software",
    527: "page-progression-direction",
    528: "override-kindle-fonts",
    529: "Compression-Upgraded",
    530: "Soft-Hyphens-In-Content",
    531: "Dictionary_In_Langague",
    532: "Dictionary_Out_Language",
    533: "Font_Converted",
    534: "Amazon_Creator_Info",
    535: "Creator-Build-Tag",
    # CONT_Header is 0, Ends with CONTAINER_BOUNDARY (or Asset_Type?)
    536: "HD-Media-Containers-Info",
    538: "Resource-Container-Fidelity",
    539: "HD-Container-Mimetype",
    540: "Sample-For_Special-Purpose",
    541: "Kindletool-Operation-Information",
    542: "Container_Id",
    543: "Asset-Type",  # FONT_CONTAINER, BW_CONTAINER, HD_CONTAINER
    544: "Unknown_544",
}
id_map_values = {
    115: "sample",
    116: "StartOffset",
    121: "Mobi8-Boundary-Section",
    125: "Embedded-Record-Count",
    130: "Offline-Sample",
    131: "Metadata-Record-Offset",
    201: "CoverOffset",
    202: "ThumbOffset",
    203: "HasFakeCover",
    204: "Creator-Software",
    205: "Creator-Major-Version",
    206: "Creator-Minor-Version",
    207: "Creator-Build-Number",
    401: "Clipping-Limit",
    402: "Publisher-Limit",
    404: "Text-to-Speech-Disabled",
    406: "Rental-Expiration-Time",
}
id_map_hexstrings = {
    208: "Watermark_(hex)",
    209: "Tamper-Proof-Keys_(hex)",
    300: "Font-Signature_(hex)",
    403: "Unknown_(403)_(hex)",
    405: "Ownership-Type_(hex)",
    407: "Unknown_(407)_(hex)",
    420: "Multimedia-Content-Reference_(hex)",
    450: "Locations_Match_(hex)",
    451: "Full-Story-Length_(hex)",
    452: "Sample-Start_Location_(hex)",
    453: "Sample-End-Location_(hex)",
}


# important  pdb header offsets
unique_id_seed = 68
number_of_pdb_records = 76

# important palmdoc header offsets
book_length = 4
book_record_count = 8
first_pdb_record = 78

# important rec0 offsets
length_of_book = 4
mobi_header_base = 16
mobi_header_length = 20
mobi_type = 24
mobi_version = 36
first_non_text = 80
title_offset = 84
first_resc_record = 108
first_content_index = 192
last_content_index = 194
kf8_fdst_index = 192
fcis_index = 200
flis_index = 208
srcs_index = 224
srcs_count = 228
primary_index = 244
datp_index = 256
huffoff = 112
hufftbloff = 120


OPF_tags = [
    "metadata",
    "dc:title",
    "dc:contributor",
    "dc:identifier",
    "dc:language",
    "dc:publisher",
    "dc:date",
    "dc:description",
    "dc:subject",
    "dc:rights",
    "dc:format",
    "identifier",
    "creator",
    "publisher",
    "title",
    "author",
    "language",
    "description",
    "subject",
]
EXTH_Types = {
    1: "drm_server_id",
    2: "drm_commerce_id",
    3: "drm_ebookbase_book_id",
    100: "author",  # <dc:Creator>
    101: "publisher",  # <dc:Publisher>
    102: "imprint",  # <Imprint>
    103: "description",  # <dc:Description>
    104: "isbn",  # <dc:Identifier scheme='ISBN'>
    105: "subject",  # Could appear multiple times	<dc:Subject>
    106: "publishingdate",  # <dc:Date>
    107: "review",  # <Review>
    108: "contributor",  # <dc:Contributor>
    109: "rights",  # <dc:Rights>
    110: "subjectcode",  # <dc:Subject BASICCode="subjectcode">
    111: "type",  # <dc:Type>
    112: "source",  # <dc:Source>
    113: "asin",  # Kindle Paperwhite labels books with "Personal"
    114: "versionnumber",
    115: "sample",  # 0x0001 if the book content is only a sample
    116: "startreading",  # Position (4-byte offset) in file when first opened
    # Mobipocket Creator adds this if Adult only is checked on its
    # GUI; contents: "yes"	<Adult>
    117: "adult",
    118: "retail",  # price	As text, e.g. "4.99"	<SRP>
    119: "retail",  # price currency As text, e.g. "USD"
    121: "KF8",  # BOUNDARY Offset
    125: "count",  # of resources
    129: "KF8",  # cover URI
    131: "Unknown",
    200: "Dictionary",  # short name	As text	<DictionaryVeryShortName>
    # Add to first image field in Mobi Header to find PDB record
    # containing the cover image	<EmbeddedCover>
    201: "coveroffset",
    # Add to first image field in Mobi Header to find PDB record
    # containing the thumbnail cover image
    202: "thumboffset",
    203: "hasfakecover",
    # Software	Known Values: 1=mobigen, 2=Mobipocket Creator,
    # 200=kindlegen (Windows), 201=kindlegen (Linux), 202=kindlegen (Mac).
    204: "Creator",
    205: "Creator",  # Major Version
    206: "Creator",  # Minor Version
    207: "Creator",  # Build Number
    208: "watermark",
    # proof keys Used by the Kindle (and Android app) for generating
    # book-specific PIDs.
    209: "tamper",
    300: "fontsignature",
    # Integer percentage of the text allowed to be clipped. Usually 10.
    401: "clippinglimit",
    402: "publisherlimit",
    403: "Unknown",
    404: "ttsflag",  # 1 - Text to Speech disabled; 0 - Text to Speech enabled
    # (Rent/Borrow flag?)	1 in this field seems to indicate a rental book
    405: "Unknown",
    # /Borrow Expiration Date	If this field is removed
    # from a rental, the book says it expired in 1969
    406: "Rent",
    407: "Unknown",
    450: "Unknown",
    451: "Unknown",
    452: "Unknown",
    453: "Unknown",
    501: "cdetype",  # PDOC - Personal Doc; EBOK - ebook; EBSP - ebook sample;
    502: "lastupdatetime",
    503: "updatedtitle",
    504: "asin",  # I found a copy of ASIN in this record.
    524: "language",  # <dc:language>
    525: "writingmode",  # I found horizontal-lr in this record.
    # Build Number	I found 1019-d6e4792 in this record,
    # which is a build number of Kindlegen 2.7
    535: "Creator",
    536: "Unknown",
    542: "Unknown",  # Some Unix timestamp.
    # String 'I\x00n\x00M\x00e\x00m\x00o\x00r\x00y\x00' found
    # in this record, for KindleGen V2.9 build 1029-0897292
    547: "InMemory",
}

META_TAGS = [
    "Drm Server Id",
    "Drm Commerce Id",
    "Drm Ebookbase Book Id",
    "ASIN",
    "ThumbOffset",
    "Fake Cover",
    "Creator Software",
    "Creator Major Version",
    "Creator Minor Version",
    "Creator Build Number",
    "Watermark",
    "Clipping Limit",
    "Publisher Limit",
    "Text to Speech Disabled",
    "CDE Type",
    "Updated Title",
    "Font Signature (hex)",
    "Tamper Proof Keys (hex)",
]

_OPF_PARENT_TAGS = [
    "xml",
    "package",
    "metadata",
    "dc-metadata",
    "x-metadata",
    "manifest",
    "spine",
    "tours",
    "guide",
]
